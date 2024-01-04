import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserRepository } from 'user/application/repository';
import {
  PlaceAggregate,
  RefreshTokenValueObject,
  User,
  UserAggregate,
  UserCheckAggregate,
} from 'user/domain';
import { UserSelector } from './user.selector';
import {
  User as PrismaUser,
  CheckedUsers as PrismaUserCheck,
  Picture as PrismaPicture,
  Place as PrismaPlace,
  Prisma,
  Token,
} from '@prisma/client';
import { Picture, PictureAggregate } from 'user/domain/picture';

@Injectable()
export class UserAdapter implements UserRepository {
  private readonly logger = new Logger(UserAdapter.name);
  constructor(private readonly prismaService: PrismaService) {}

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

      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: dataToUpdate,
        include: UserSelector.selectUser(),
      });

      this.standardUser(updatedUser);

      return this.getUserAggregate(updatedUser);
    }

    const saved = await this.prismaService.user.create({
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
    const toCreatePictures: Picture[] = [];

    await Promise.all(
      user.pictures.map(async (picture) => {
        if (
          !existingUser.pictures.find(
            (existingPicture) => existingPicture.id === picture.id,
          )
        ) {
          const createdPicture = await PictureAggregate.create(
            picture,
          ).getPicture();
          toCreatePictures.push(createdPicture);
        }
      }),
    );

    existingUser.pictures.forEach((existingPicture) => {
      if (!user.pictures.find((picture) => picture.id === existingPicture.id)) {
        toDeleteIds.push(existingPicture.id);
      }
    });

    await this.prismaService.picture.deleteMany({
      where: { id: { in: toDeleteIds } },
    });

    await this.prismaService.picture.createMany({
      data: toCreatePictures,
    });

    const updatedPictures = await this.prismaService.picture.findMany({
      where: { userId: existingUser.id },
    });

    await Promise.all(
      user.pictures.map((newPicture: Picture) => {
        const picture = updatedPictures.find(
          (item) => item.id === newPicture.id,
        );

        if (newPicture.order !== picture.order) {
          return this.prismaService.picture.update({
            where: { id: picture.id },
            data: { order: newPicture.order },
          });
        }
      }),
    );
  }

  private async updatePlace(user: UserAggregate) {
    const place = user.place;
    await this.prismaService.place.upsert({
      where: { id: user.id },
      create: {
        ...place,
        user: { connect: { id: user.id } },
      },
      update: place,
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
          await this.prismaService[fieldToUpdate].findUnique({
            where: { name: user[fieldToUpdate] },
            select: { id: true },
          })
        )?.id;
      }

      if (!existingRelationId && user[fieldToUpdate] !== null) {
        throw new NotFoundException();
      }

      await this.prismaService.user.update({
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
      await this.prismaService.interest.findMany({
        select: { name: true },
      })
    ).map((interestObject) => interestObject.name);

    const { toConnect, toDisconnect } = this.compareUserRelationFieldIds(
      user.interests,
      newInterests,
      allExistingInterests,
    );

    if (toConnect.length) {
      await this.prismaService.$transaction(
        toConnect.map((interest) =>
          this.prismaService.user.update({
            where: { id: user.id },
            data: { interests: { connect: { name: interest } } },
          }),
        ),
      );
    }
    if (toDisconnect.length) {
      await this.prismaService.$transaction(
        toDisconnect.map((interest) =>
          this.prismaService.user.update({
            where: { id: user.id },
            data: { interests: { disconnect: { name: interest } } },
          }),
        ),
      );
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

  async saveRefreshToken(
    refreshToken: RefreshTokenValueObject,
  ): Promise<RefreshTokenValueObject> {
    const existingRefreshToken = await this.findRefreshToken(refreshToken.id);

    if (existingRefreshToken) {
      const { id, ...toUpdate } = refreshToken;
      const updatedRefreshToken = await this.prismaService.token.update({
        where: { id },
        data: {
          refreshToken: toUpdate.value,
          createdAt: toUpdate.createdAt,
          updatedAt: toUpdate.updatedAt,
        },
      });

      return this.getRefreshTokenAggregate(updatedRefreshToken);
    }

    const savedRefreshToken = await this.prismaService.token.create({
      data: {
        id: refreshToken.id,
        refreshToken: refreshToken.value,
        createdAt: refreshToken.createdAt,
        updatedAt: refreshToken.updatedAt,
      },
    });

    return this.getRefreshTokenAggregate(savedRefreshToken);
  }

  async findOne(id: string): Promise<UserAggregate | null> {
    const existingUser = await this.prismaService.user
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
    const existingUser = await this.prismaService.user
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

  async findPair(id: string, forId: string): Promise<UserAggregate | null> {
    const pair = await this.prismaService.user
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

  async findPairs(id: string): Promise<UserAggregate[]> {
    const pairs = await this.prismaService.user.findMany({
      where: { pairFor: { some: { id } } },
      include: UserSelector.selectUser(),
    });

    return pairs.map((pair) => {
      this.standardUser(pair);
      return this.getUserAggregate(pair);
    });
  }

  async findManyPictures(userId: string): Promise<PictureAggregate[]> {
    const pictures = await this.prismaService.picture.findMany({
      where: { userId },
    });

    return pictures.map((picture) => this.getPictureAggregate(picture));
  }

  async findCheckedUserIds(id: string, checkId: string): Promise<string[]> {
    const checkedUsers = await this.prismaService.checkedUsers.findMany({
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
  ): Promise<UserCheckAggregate> {
    const pairIds = (
      await this.prismaService.user.findUnique({
        where: { id: checkedByUserId },
        select: { pairFor: { select: { id: true } } },
      })
    ).pairFor.map((pair) => pair.id);

    const userCheck = await this.prismaService.checkedUsers.findFirst({
      where: {
        wasCheckedId: checkedByUserId,
        checked: { id: { notIn: pairIds } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!userCheck) {
      return null;
    }

    return this.getUserCheckAggregate(userCheck);
  }

  async findRefreshToken(id: string): Promise<RefreshTokenValueObject> {
    const existingRefreshToken = await this.prismaService.token
      .findUnique({
        where: { id },
      })
      .catch(() => {
        return null;
      });

    if (!existingRefreshToken) {
      return null;
    }

    return this.getRefreshTokenAggregate(existingRefreshToken);
  }

  async findRefreshTokenByValue(
    value: string,
  ): Promise<RefreshTokenValueObject> {
    const existingRefreshToken = await this.prismaService.token
      .findUnique({
        where: { refreshToken: value },
      })
      .catch(() => {
        return null;
      });

    if (!existingRefreshToken) {
      return null;
    }

    return this.getRefreshTokenAggregate(existingRefreshToken);
  }

  async createPair(id: string, forId: string): Promise<UserAggregate> {
    const pair = await this.prismaService.user.update({
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
    const result = await this.prismaService.checkedUsers.create({
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
    const checkedUsers = await this.prismaService.checkedUsers.findMany({
      where: { OR: [{ checkedId: id }, { wasCheckedId: id }] },
      select: {
        checked: { select: { id: true } },
        wasChecked: { select: { id: true } },
      },
    });
    const checkedIds = checkedUsers.map((user) => user.checked.id);
    const wasCheckedIds = checkedUsers.map((user) => user.wasChecked.id);

    const sortedUser = await this.prismaService.user.findFirst({
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

  async findPlace(userId: string): Promise<PlaceAggregate | null> {
    const place = await this.prismaService.place.findUnique({
      where: { id: userId },
    });

    return this.getPlaceAggregate(place);
  }

  async delete(id: string): Promise<boolean> {
    const deletedUser = await this.prismaService.user
      .delete({ where: { id } })
      .catch((err) => {
        this.logger.error(err);
        return false;
      });

    return Boolean(deletedUser);
  }

  async deletePair(id: string, forId: string): Promise<boolean> {
    const deletedPair = await this.prismaService.user.update({
      where: { id: forId },
      data: { pairs: { disconnect: { id } } },
    });

    return Boolean(deletedPair);
  }

  async deleteUserCheck(
    checkedId: string,
    wasCheckedId: string,
  ): Promise<boolean> {
    const deletedUserCheck = await this.prismaService.checkedUsers.delete({
      where: {
        checkedId_wasCheckedId: {
          checkedId: checkedId,
          wasCheckedId: wasCheckedId,
        },
      },
    });

    return Boolean(deletedUserCheck);
  }

  async deleteRefreshToken(id: string): Promise<boolean> {
    const deletedRefreshToken = await this.prismaService.token
      .delete({ where: { id } })
      .catch(() => {
        return false;
      });

    return Boolean(deletedRefreshToken);
  }

  private getPictureAggregate(picture: PrismaPicture): PictureAggregate {
    return PictureAggregate.create({
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

  private getPlaceAggregate(place: PrismaPlace): PlaceAggregate {
    return PlaceAggregate.create({
      ...place,
      updatedAt: place.updatedAt.toISOString(),
      createdAt: place.createdAt.toISOString(),
    });
  }

  private getUserCheckAggregate(
    userCheck: PrismaUserCheck,
  ): UserCheckAggregate {
    return UserCheckAggregate.create({
      ...userCheck,
      createdAt: userCheck.createdAt.toISOString(),
      updatedAt: userCheck.updatedAt.toISOString(),
    });
  }

  private getRefreshTokenAggregate(
    refreshToken: Token,
  ): RefreshTokenValueObject {
    return RefreshTokenValueObject.create({
      ...refreshToken,
      value: refreshToken.refreshToken,
      updatedAt: refreshToken.updatedAt.toISOString(),
      createdAt: refreshToken.createdAt.toISOString(),
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
      (interestObject) => interestObject.name,
    );
  }
}
