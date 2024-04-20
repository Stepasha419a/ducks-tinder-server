import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@app/common/database';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { User, UserAggregate } from 'apps/user/src/domain/user';
import { UserSelector } from './user.selector';
import {
  User as PrismaUser,
  CheckedUsers as PrismaUserCheck,
  Picture as PrismaPicture,
  Place as PrismaPlace,
  Prisma,
} from '@prisma/client';
import {
  PictureValueObject,
  PlaceValueObject,
  UserCheckValueObject,
} from 'apps/user/src/domain/user/value-object';
import { PairsFilterDto } from 'apps/user/src/domain/user/repository/dto';
import { MapUtil } from '@app/common/shared/util';

@Injectable()
export class UserAdapter implements UserRepository {
  private readonly logger = new Logger(UserAdapter.name);
  constructor(private readonly databaseService: DatabaseService) {}

  async save(user: UserAggregate): Promise<UserAggregate | null> {
    const existingUser = await this.findOne(user.id);
    if (existingUser) {
      const differentKeys = this.getDifferences(user, existingUser);

      if (
        differentKeys.some((key) => this.primitiveRelationFields.includes(key))
      ) {
        await this.updatePrimitiveRelations(user, differentKeys);
      }

      if (differentKeys.includes('interests')) {
        await this.updateInterests(existingUser, user.interests);
      }

      if (differentKeys.includes('place')) {
        await this.updatePlace(user);
      }

      if (differentKeys.includes('pictures')) {
        await this.updatePictures(user, existingUser);
      }

      const dataToUpdate = (await user.getPrimitiveFields()) as Prisma.Without<
        Prisma.UserUpdateInput,
        Prisma.UserUncheckedUpdateInput
      > &
        Prisma.UserUncheckedUpdateInput;

      const updatedUser = await this.databaseService.user.update({
        where: { id: user.id },
        data: { ...dataToUpdate, updatedAt: new Date().toISOString() },
        include: UserSelector.selectUser(),
      });

      this.standardUser(updatedUser);

      return this.getUserAggregate(updatedUser);
    }

    const saved = await this.databaseService.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
      },
      include: UserSelector.selectUser(),
    });

    this.standardUser(saved);

    return this.getUserAggregate(saved);
  }

  private async updatePictures(
    user: UserAggregate,
    existingUser: UserAggregate,
  ) {
    const toDeleteIds: string[] = [];
    const toCreatePictures: PictureValueObject[] = [];

    user.pictures.forEach((picture) => {
      if (
        !existingUser.pictures.find(
          (existingPicture) => existingPicture.id === picture.id,
        )
      ) {
        const createdPicture = PictureValueObject.create(picture);
        toCreatePictures.push(createdPicture);
      }
    });

    existingUser.pictures.forEach((existingPicture) => {
      if (!user.pictures.find((picture) => picture.id === existingPicture.id)) {
        toDeleteIds.push(existingPicture.id);
      }
    });

    await this.databaseService.picture.deleteMany({
      where: { id: { in: toDeleteIds } },
    });

    await this.databaseService.picture.createMany({
      data: toCreatePictures,
    });

    const updatedPictures = await this.databaseService.picture.findMany({
      where: { userId: existingUser.id },
    });

    await Promise.all(
      user.pictures.map((newPicture: PictureValueObject) => {
        const picture = updatedPictures.find(
          (item) => item.id === newPicture.id,
        );

        if (newPicture.order !== picture.order) {
          return this.databaseService.picture.update({
            where: { id: picture.id },
            data: {
              order: newPicture.order,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      }),
    );
  }

  private async updatePlace(user: UserAggregate) {
    const place = user.place;
    await this.databaseService.place.upsert({
      where: { id: user.id },
      create: {
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        createdAt: place.createdAt,
        updatedAt: place.updatedAt,
        user: { connect: { id: user.id } },
      },
      update: {
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  private async updatePrimitiveRelations(
    user: UserAggregate,
    differentKeys: Array<keyof User>,
  ) {
    const primitiveRelationKeysToUpdate =
      this.getPrimitiveRelationKeysToUpdate(differentKeys);

    for (const fieldToUpdate of primitiveRelationKeysToUpdate) {
      let existingRelationId = null;
      if (user[fieldToUpdate] !== null) {
        existingRelationId = (
          await this.databaseService[fieldToUpdate].findUnique({
            where: { name: user[fieldToUpdate] },
            select: { id: true },
          })
        )?.id;
      }

      if (!existingRelationId && user[fieldToUpdate] !== null) {
        throw new NotFoundException();
      }

      await this.databaseService.user.update({
        where: { id: user.id },
        data: {
          [`${fieldToUpdate}Id`]: existingRelationId,
        },
      });
    }
  }

  private async updateInterests(user: UserAggregate, newInterests?: string[]) {
    if (!newInterests) {
      return {};
    }

    const allExistingInterests = (
      await this.databaseService.interest.findMany({
        select: { name: true },
      })
    ).map((interestObject) => interestObject.name);

    const { toConnect, toDisconnect } = this.compareUserRelationFieldIds(
      user.interests,
      newInterests,
      allExistingInterests,
    );

    if (toConnect.length) {
      const interestConnect = (
        await this.databaseService.interest.findMany({
          where: { name: { in: toConnect } },
        })
      ).map((interest) => ({ interestId: interest.id, userId: user.id }));

      this.databaseService.usersOnInterests.createMany({
        data: interestConnect,
      });
    }
    if (toDisconnect.length) {
      const interestIds = (
        await this.databaseService.interest.findMany({
          where: { name: { in: toConnect } },
        })
      ).map((interest) => interest.id);

      this.databaseService.usersOnInterests.deleteMany({
        where: { userId: user.id, interestId: { in: interestIds } },
      });
    }
  }

  private compareUserRelationFieldIds(
    oldInterests: string[],
    newInterests: string[],
    allExistingInterests: string[],
  ) {
    const toConnect = [];
    const toDisconnect = [];

    newInterests.forEach((interest) => {
      if (
        !oldInterests.includes(interest) &&
        allExistingInterests.includes(interest)
      ) {
        toConnect.push(interest);
      }
    });

    oldInterests.forEach((interest) => {
      if (!newInterests.includes(interest)) {
        toDisconnect.push(interest);
      }
    });

    return { toConnect, toDisconnect };
  }

  private getDifferences(oldUser, newUser): Array<keyof User> {
    const keysToUpdate = [];
    for (const key in newUser) {
      if (typeof oldUser[key] !== 'object' && oldUser[key] !== newUser[key]) {
        keysToUpdate.push(key);
      } else if (
        JSON.stringify(oldUser[key]) !== JSON.stringify(newUser[key])
      ) {
        keysToUpdate.push(key);
      }
    }
    return keysToUpdate;
  }

  private getPrimitiveRelationKeysToUpdate(keysToUpdate: Array<keyof User>) {
    const primitiveRelationKeysToUpdate: Array<keyof User> = [];

    for (const key of keysToUpdate) {
      if (this.primitiveRelationFields.includes(key as keyof User)) {
        primitiveRelationKeysToUpdate.push(key as keyof User);
      }
    }

    return primitiveRelationKeysToUpdate;
  }

  private primitiveRelationFields: Array<keyof User> = [
    'alcoholAttitude',
    'attentionSign',
    'childrenAttitude',
    'chronotype',
    'communicationStyle',
    'education',
    'foodPreference',
    'personalityType',
    'pet',
    'smokingAttitude',
    'socialNetworksActivity',
    'trainingAttitude',
    'zodiacSign',
  ];

  async findOne(id: string): Promise<UserAggregate | null> {
    const existingUser = await this.databaseService.user
      .findUnique({
        where: { id },
        include: UserSelector.selectUser(),
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!existingUser) {
      return null;
    }

    this.standardUser(existingUser);

    return this.getUserAggregate(existingUser);
  }

  async findOneByEmail(email: string): Promise<UserAggregate | null> {
    const existingUser = await this.databaseService.user
      .findUnique({
        where: { email },
        include: UserSelector.selectUser(),
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!existingUser) {
      return null;
    }

    this.standardUser(existingUser);

    return this.getUserAggregate(existingUser);
  }

  async findMany(ids: string[]): Promise<UserAggregate[]> {
    const users = await this.databaseService.user
      .findMany({
        where: { id: { in: ids } },
        include: UserSelector.selectUser(),
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    return users.map((user) => {
      this.standardUser(user);
      return this.getUserAggregate(user);
    });
  }

  async findPair(id: string, forId: string): Promise<UserAggregate | null> {
    const pair = await this.databaseService.user
      .findFirst({
        where: { id, pairFor: { some: { id: forId } } },
        include: UserSelector.selectUser(),
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!pair) {
      return null;
    }

    this.standardUser(pair);

    return this.getUserAggregate(pair);
  }

  async findPairs(id: string, dto: PairsFilterDto): Promise<UserAggregate[]> {
    let joinQuery = '';
    let whereQuery = '';
    let groupByQuery = '';

    if (dto.ageFrom !== 18 || dto.ageTo !== 100) {
      whereQuery += ` and users.age between ${dto.ageFrom} and ${dto.ageTo} `;
    }

    if (dto.distance !== 100) {
      const place = await this.databaseService.place.findUnique({
        where: {
          id,
        },
      });

      const { maxLatitude, minLatitude, maxLongitude, minLongitude } =
        MapUtil.getSearchingCoords(
          place?.latitude,
          place?.longitude,
          dto.distance,
        );

      joinQuery += 'inner join places on places.id = users.id ';
      whereQuery += ` and places.latitude between ${minLatitude} and ${maxLatitude} and places.longitude between ${minLongitude} and ${maxLongitude}`;
    }

    if (dto.interests?.length) {
      const interests = `'${dto.interests.join("', '")}'`;

      joinQuery +=
        'inner join "users-on-interests" on "users-on-interests"."userId" = users.id inner join interests on interests.id = "users-on-interests"."interestId"';
      whereQuery += ` and interests.name in (${interests})`;
      groupByQuery += `group by users.id having count(*) = ${dto.interests.length}`;
    }

    if (dto.identifyConfirmed) {
      whereQuery += ` and users."isActivated" = true`;
    }

    if (dto.hasInterests) {
      whereQuery += ` and (
        select count(*) from "users-on-interests" where "users-on-interests"."userId" = users.id
      ) > 0`;
    }

    if (dto.pictures) {
      whereQuery += ` and (
        select count(*) from pictures where pictures."userId" = users.id
      ) >= ${dto.pictures}`;
    }

    const query = `
    select users.id 
    from users
    ${joinQuery} 
    inner join "_Pairs" on "_Pairs"."A" = users.id 
    where "_Pairs"."B" = \'${id}\' 
    ${whereQuery}
    ${groupByQuery}
    offset ${dto.skip}
    fetch next ${dto.take} rows only`;

    const ids = (
      (await this.databaseService.$queryRaw`${Prisma.raw(query)}`) as Array<{
        id: string;
      }>
    ).map((user) => user.id);

    const pairs = await this.databaseService.user.findMany({
      where: { id: { in: ids } },
      include: UserSelector.selectUser(),
    });

    return pairs.map((pair) => {
      this.standardUser(pair);
      return this.getUserAggregate(pair);
    });
  }

  findPairsCount(id: string): Promise<number> {
    return this.databaseService.user.count({
      where: { pairFor: { some: { id } } },
    });
  }

  async findFirstPairsPicture(id: string): Promise<PictureValueObject> {
    const picture = await this.databaseService.picture.findFirst({
      where: { order: 0, user: { pairFor: { some: { id } } } },
    });

    if (!picture) {
      return null;
    }

    return this.getPictureValueObject(picture);
  }

  async findCheckedUserIds(id: string, checkId: string): Promise<string[]> {
    // TODO: optimize by not getting an array with many checks (too big arrays)
    const checkedUsers = await this.databaseService.checkedUsers.findMany({
      where: { OR: [{ checkedId: id }, { checkedId: checkId }] },
      select: {
        checked: { select: { id: true } },
        wasChecked: { select: { id: true } },
      },
    });

    const checkedIds = checkedUsers.map((user) => user.checked.id);
    const wasCheckedIds = checkedUsers.map((user) => user.wasChecked.id);

    return checkedIds.concat(wasCheckedIds);
  }

  async findUserNotPairCheck(
    checkedByUserId: string,
  ): Promise<UserCheckValueObject> {
    const pairIds = (
      await this.databaseService.user.findUnique({
        where: { id: checkedByUserId },
        select: { pairFor: { select: { id: true } } },
      })
    ).pairFor.map((pair) => pair.id);

    const userCheck = await this.databaseService.checkedUsers.findFirst({
      where: {
        wasCheckedId: checkedByUserId,
        checked: { id: { notIn: pairIds } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!userCheck) {
      return null;
    }

    return this.getUserCheckValueObject(userCheck);
  }

  async createPair(id: string, forId: string): Promise<UserAggregate> {
    const pair = await this.databaseService.user.update({
      where: { id: forId },
      data: {
        pairs: { connect: { id } },
      },
      include: UserSelector.selectUser(),
    });

    this.standardUser(pair);

    return this.getUserAggregate(pair);
  }

  async makeChecked(id: string, forId: string): Promise<boolean> {
    const result = await this.databaseService.checkedUsers.create({
      data: { wasCheckedId: forId, checkedId: id },
    });

    return Boolean(result);
  }

  async findSorted(
    id: string,
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number,
    preferAgeFrom: number,
    preferAgeTo: number,
    age: number,
    preferSex: 'male' | 'female',
    sex: 'male' | 'female',
  ): Promise<UserAggregate | null> {
    const checkedUsers = await this.databaseService.checkedUsers.findMany({
      where: { OR: [{ checkedId: id }, { wasCheckedId: id }] },
      select: {
        checked: { select: { id: true } },
        wasChecked: { select: { id: true } },
      },
    });
    const checkedIds = checkedUsers.map((user) => user.checked.id);
    const wasCheckedIds = checkedUsers.map((user) => user.wasChecked.id);

    const sortedUser = await this.databaseService.user.findFirst({
      where: {
        id: { notIn: [...checkedIds, ...wasCheckedIds, id] },
        place: {
          latitude: { gte: minLatitude, lte: maxLatitude },
          longitude: { gte: minLongitude, lte: maxLongitude },
        },
        age: {
          gte: preferAgeFrom,
          lte: preferAgeTo,
        },
        preferAgeFrom: {
          lte: age,
        },
        preferAgeTo: {
          gte: age,
        },
        sex: preferSex,
        preferSex: sex,
      },
      include: UserSelector.selectUser(),
    });

    if (!sortedUser) {
      return null;
    }

    this.standardUser(sortedUser);

    return this.getUserAggregate(sortedUser);
  }

  async findPlace(userId: string): Promise<PlaceValueObject | null> {
    const place = await this.databaseService.place.findUnique({
      where: { id: userId },
    });

    return this.getPlaceValueObject(place);
  }

  async delete(id: string): Promise<boolean> {
    const deletedUser = await this.databaseService.user
      .delete({ where: { id } })
      .catch((err) => {
        this.logger.error(err);
        return false;
      });

    return Boolean(deletedUser);
  }

  async deletePair(id: string, forId: string): Promise<boolean> {
    const deletedPair = await this.databaseService.user.update({
      where: { id: forId },
      data: { pairs: { disconnect: { id } } },
    });

    return Boolean(deletedPair);
  }

  async deleteUserCheck(
    checkedId: string,
    wasCheckedId: string,
  ): Promise<boolean> {
    const deletedUserCheck = await this.databaseService.checkedUsers.delete({
      where: {
        checkedId_wasCheckedId: {
          checkedId: checkedId,
          wasCheckedId: wasCheckedId,
        },
      },
    });

    return Boolean(deletedUserCheck);
  }

  private getPictureValueObject(picture: PrismaPicture): PictureValueObject {
    return PictureValueObject.create({
      ...picture,
      updatedAt: picture.updatedAt.toISOString(),
      createdAt: picture.createdAt.toISOString(),
    });
  }

  private getUserAggregate(user: PrismaUser): UserAggregate {
    return UserAggregate.create({
      ...user,
      updatedAt: user.updatedAt.toISOString(),
      createdAt: user.createdAt.toISOString(),
    });
  }

  private getPlaceValueObject(place: PrismaPlace): PlaceValueObject {
    return PlaceValueObject.create({
      ...place,
      updatedAt: place.updatedAt.toISOString(),
      createdAt: place.createdAt.toISOString(),
    });
  }

  private getUserCheckValueObject(
    userCheck: PrismaUserCheck,
  ): UserCheckValueObject {
    return UserCheckValueObject.create({
      ...userCheck,
      createdAt: userCheck.createdAt.toISOString(),
    });
  }

  private standardUser(user) {
    this.standardUserPrimitiveRelations(user);
    this.standardUserInterests(user);
    this.standardUserPictures(user);
  }

  private standardUserPictures(user) {
    for (const picture of user.pictures) {
      picture.createdAt = picture.createdAt.toISOString();
      picture.updatedAt = picture.updatedAt.toISOString();
    }
  }

  private standardUserPrimitiveRelations(user) {
    for (const key in user) {
      if (
        this.primitiveRelationFields.includes(key as keyof User) &&
        user[key] !== null
      ) {
        user[key] = user[key].name;
      }
    }
  }

  private standardUserInterests(user) {
    user.interests = user.interests.map(
      (interestObject) => interestObject.interest.name,
    );
  }
}
