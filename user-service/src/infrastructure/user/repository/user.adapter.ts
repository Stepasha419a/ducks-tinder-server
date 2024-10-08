import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { Interest, User, UserAggregate } from 'src/domain/user';
import { UserSelector } from './user.selector';
import {
  User as PrismaUser,
  CheckedUsers as PrismaUserCheck,
  Picture as PrismaPicture,
  Place as PrismaPlace,
  Prisma,
} from '@prisma/client';
import { MatchFilterDto, PairsFilterDto } from 'src/domain/user/repository/dto';
import {
  PictureEntity,
  PlaceEntity,
  UserCheckEntity,
} from 'src/domain/user/entity';
import { DatabaseService } from 'src/infrastructure/database';

@Injectable()
export class UserAdapter implements UserRepository {
  private readonly logger = new Logger(UserAdapter.name);
  constructor(private readonly databaseService: DatabaseService) {}

  async save(user: UserAggregate): Promise<UserAggregate | null> {
    const existingUser = await this.findOne(user.id);
    if (existingUser) {
      const differentKeys = this.getDifferences(user, existingUser);

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
        name: user.name,
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
    const toCreatePictures: PictureEntity[] = [];

    user.pictures.forEach((picture) => {
      if (
        !existingUser.pictures.find(
          (existingPicture) => existingPicture.id === picture.id,
        )
      ) {
        const createdPicture = PictureEntity.create(picture);
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
      user.pictures.map((newPicture: PictureEntity) => {
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

  private async updateInterests(
    user: UserAggregate,
    newInterests?: Interest[],
  ) {
    if (!newInterests) {
      return {};
    }

    const { toConnect, toDisconnect } = this.compareUserRelationFieldIds(
      user.interests,
      newInterests,
    );

    if (toConnect.length) {
      await this.databaseService.usersOnInterests.createMany({
        data: toConnect.map((interest) => ({
          userId: user.id,
          interest: interest,
        })),
      });
    }
    if (toDisconnect.length) {
      await this.databaseService.usersOnInterests.deleteMany({
        where: {
          userId: user.id,
          interest: { in: toDisconnect },
        },
      });
    }
  }

  private compareUserRelationFieldIds(
    oldInterests: Interest[],
    newInterests: Interest[],
  ) {
    const toConnect: Interest[] = [];
    const toDisconnect: Interest[] = [];

    newInterests.forEach((interest) => {
      if (
        !oldInterests.includes(interest) &&
        Object.values(Interest).includes(interest)
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

  async savePair(id: string, forId: string): Promise<UserAggregate> {
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

  async saveUserCheck(userCheck: UserCheckEntity): Promise<UserCheckEntity> {
    const saved = await this.databaseService.checkedUsers.upsert({
      where: {
        checkedId_wasCheckedId: {
          checkedId: userCheck.checkedId,
          wasCheckedId: userCheck.wasCheckedId,
        },
      },
      create: userCheck,
      update: userCheck,
    });

    return this.getUserCheckEntity(saved);
  }

  async saveLastReturnable(
    id: string,
    returnableUser: UserAggregate,
  ): Promise<UserAggregate> {
    const existingUsers = await this.findMany([id, returnableUser.id]);
    if (!existingUsers || !existingUsers.length) {
      return null;
    }

    const lastReturnableUser = await this.databaseService.user.update({
      where: { id: id },
      data: { lastReturnableId: returnableUser.id },
      include: UserSelector.selectUser(),
    });

    this.standardUser(lastReturnableUser);
    return this.getUserAggregate(lastReturnableUser);
  }

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

    const place = await this.findPlace(id);

    if (dto.ageFrom !== 18 || dto.ageTo !== 100) {
      whereQuery += ` and users.age between ${dto.ageFrom} and ${dto.ageTo} `;
    }

    if (dto.distance !== 100 && place) {
      joinQuery += 'inner join places on places.id = users.id ';
      whereQuery += ` and 6371 * 2 * asin(
        sqrt(
          power(sin(radians((places.latitude - ${place.latitude}) / 2)), 2) +
          cos(radians(${place.latitude})) * cos(radians(places.latitude)) * power(sin(radians((longitude - ${place.longitude}) / 2)), 2)
        )
      ) <= ${dto.distance}`;
    }

    if (dto.interests?.length) {
      const interests = `'${dto.interests.join("', '")}'`;

      joinQuery +=
        'inner join "users-on-interests" on "users-on-interests"."userId" = users.id';
      whereQuery += ` and "users-on-interests".interest in (${interests})`;
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

    return Promise.all(
      pairs.map(async (pair) => {
        this.standardUser(pair);
        const aggregate = this.getUserAggregate(pair);

        await aggregate.setDistanceBetweenPlaces(place);

        return aggregate;
      }),
    );
  }

  findPairsCount(id: string): Promise<number> {
    return this.databaseService.user.count({
      where: { pairFor: { some: { id } } },
    });
  }

  async findFirstPairsPicture(id: string): Promise<PictureEntity> {
    const picture = await this.databaseService.picture.findFirst({
      where: { order: 0, user: { pairFor: { some: { id } } } },
    });

    if (!picture) {
      return null;
    }

    return this.getPictureEntity(picture);
  }

  async findUserChecksWithUser(
    id: string,
    checkId: string,
  ): Promise<UserCheckEntity[]> {
    // TODO: optimize by not getting an array with many checks (too big arrays)
    const checkedUsers = await this.databaseService.checkedUsers.findMany({
      where: {
        OR: [
          { checkedId: id, wasCheckedId: checkId },
          { checkedId: checkId, wasCheckedId: id },
        ],
      },
    });

    return checkedUsers.map((item) => this.getUserCheckEntity(item));
  }

  async findLastReturnableUser(id: string): Promise<UserAggregate | null> {
    const lastReturnableUser = (
      await this.databaseService.user.findUnique({
        where: { id },
        select: {
          lastReturnable: {
            include: UserSelector.selectUser(),
          },
        },
      })
    )?.lastReturnable;

    if (!lastReturnableUser) {
      return null;
    }

    this.standardUser(lastReturnableUser);

    return this.getUserAggregate(lastReturnableUser);
  }

  async findMatch(
    user: UserAggregate,
    dto: MatchFilterDto,
  ): Promise<UserAggregate[]> {
    const {
      id,
      place: { latitude, longitude },
      preferAgeFrom,
      preferAgeTo,
      age,
      preferSex,
      sex,
    } = user;

    const distance = user.usersOnlyInDistance ? user.distance : 150;

    const checkedUsers = await this.databaseService.checkedUsers.findMany({
      where: { OR: [{ checkedId: id }, { wasCheckedId: id }] },
      select: {
        checked: { select: { id: true } },
        wasChecked: { select: { id: true } },
      },
    });
    const checkedIds = checkedUsers.map((user) => user.checked.id);
    const wasCheckedIds = checkedUsers.map((user) => user.wasChecked.id);

    let skip = '';
    if (dto.skipUserIds.length) {
      skip = `and users.id not in ('${dto.skipUserIds.join("', '")}')`;
    }

    const query = `select users.id from users
    inner join places on users.id = places.id
    where users.id not in ('${[...checkedIds, ...wasCheckedIds, id].join("', '")}')
    and 6371 * 2 * asin(
      sqrt(
        power(sin(radians((places.latitude - ${latitude}) / 2)), 2) +
        cos(radians(${latitude})) * cos(radians(places.latitude)) * power(sin(radians((longitude - ${longitude}) / 2)), 2)
      )
    ) <= ${distance}
    and users.age between ${preferAgeFrom} and ${preferAgeTo} 
    and users."preferAgeFrom" < ${age} 
    and users."preferAgeTo" > ${age}
    and users.sex = '${preferSex}'
    and users."preferSex" = '${sex}'
    ${skip}
    fetch next ${dto.take} rows only
    `;

    const matchRes = (await this.databaseService
      .$queryRaw`${Prisma.raw(query)}`) as { id: string }[];

    if (!matchRes || !matchRes.length) {
      return [];
    }

    const matchIds = matchRes.map((match) => match.id);

    const matchUsers = await this.databaseService.user.findMany({
      where: { id: { in: matchIds } },
      include: UserSelector.selectUser(),
    });

    return matchUsers.map((user) => {
      this.standardUser(user);

      return this.getUserAggregate(user);
    });
  }

  async findPlace(userId: string): Promise<PlaceEntity | null> {
    const place = await this.databaseService.place.findUnique({
      where: { id: userId },
    });

    if (!place) {
      return null;
    }

    return this.getPlaceEntity(place);
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

  async deleteLastReturnable(id: string): Promise<boolean> {
    const deleted = await this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        lastReturnableId: null,
      },
    });

    return Boolean(deleted);
  }

  async deleteUserCheck(
    checkedId: string,
    wasCheckedId: string,
  ): Promise<boolean> {
    const deleted = await this.databaseService.checkedUsers.delete({
      where: {
        checkedId_wasCheckedId: {
          checkedId,
          wasCheckedId,
        },
      },
    });

    return Boolean(deleted);
  }

  private getPictureEntity(picture: PrismaPicture): PictureEntity {
    return PictureEntity.create({
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
    } as unknown as User);
  }

  private getPlaceEntity(place: PrismaPlace): PlaceEntity {
    return PlaceEntity.create({
      ...place,
      updatedAt: place.updatedAt.toISOString(),
      createdAt: place.createdAt.toISOString(),
    });
  }

  private getUserCheckEntity(userCheck: PrismaUserCheck): UserCheckEntity {
    return UserCheckEntity.create({
      ...userCheck,
      createdAt: userCheck.createdAt.toISOString(),
    });
  }

  private standardUser(user) {
    this.standardUserInterests(user);
    this.standardUserPictures(user);
  }

  private standardUserPictures(user) {
    for (const picture of user.pictures) {
      picture.createdAt = picture.createdAt.toISOString();
      picture.updatedAt = picture.updatedAt.toISOString();
    }
  }

  private standardUserInterests(user) {
    user.interests = user.interests.map(
      (interestObject) => interestObject.interest,
    );
  }
}
