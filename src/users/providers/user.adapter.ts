import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User as PrismaUser } from 'prisma';
import { PrismaService } from 'prisma/prisma.service';
import { UserRepository } from './user.repository';
import { User, UserAggregate } from 'users/domain';
import { UsersSelector } from 'users/users.selector';
import { Prisma } from '@prisma/client';
import { PictureAggregate } from 'users/domain/picture';

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

      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: this.getUserAggregateToUpdate(user, existingUser, differentKeys),
        include: UsersSelector.selectUser(),
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
      include: UsersSelector.selectUser(),
    });

    this.standardUser(saved);

    return this.getUserAggregate(saved);
  }

  private getUserAggregateToUpdate(
    user: UserAggregate,
    existingUser?: UserAggregate,
    differentKeys?: Array<keyof User>,
  ):
    | (Prisma.Without<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput> &
        Prisma.UserUncheckedUpdateInput)
    | (Prisma.Without<Prisma.UserUncheckedUpdateInput, Prisma.UserUpdateInput> &
        Prisma.UserUpdateInput) {
    const picturesToUpdate = this.getPicturesToUpdate(
      user,
      existingUser,
      differentKeys,
    );

    return {
      ...user.getPrimitiveFields(),
      ...picturesToUpdate,
      place: {},
    };
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

  private getPicturesToUpdate(
    user: UserAggregate,
    existingUser?: UserAggregate,
    differentKeys?: Array<keyof User>,
  ):
    | Record<
        'pictures',
        Prisma.PictureUncheckedUpdateManyWithoutUserNestedInput
      >
    | undefined {
    if (existingUser && !differentKeys.includes('pictures')) {
      return {
        pictures: this.getUserPicturesUpdate(
          user.pictures,
          existingUser.pictures,
        ) as Prisma.PictureUncheckedUpdateManyWithoutUserNestedInput,
      };
    }
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

  private getUserPicturesUpdate(
    newPictures: PictureAggregate[],
    oldPictures: PictureAggregate[] | undefined = [],
  ) {
    const res = {
      createMany: { data: [] },
      deleteMany: { data: [] },
    };
    for (const newPicture of newPictures) {
      if (
        !oldPictures.some(
          (oldPicture) =>
            oldPicture.name === newPicture.name &&
            oldPicture.order === newPicture.order,
        )
      ) {
        res.createMany.data.push({
          name: newPicture.name,
          order: newPicture.order,
        });
      }
    }

    for (const oldPicture of oldPictures) {
      if (
        !newPictures.some(
          (newPicture) =>
            newPicture.name === oldPicture.name &&
            newPicture.order === oldPicture.order,
        )
      ) {
        res.deleteMany.data.push({
          name: oldPicture.name,
          order: oldPicture.order,
        });
      }
    }

    if (!res.createMany.data.length && !res.deleteMany.data.length) {
      return {};
    }

    return res;
  }

  async findOne(id: string): Promise<UserAggregate | null> {
    const existingUser = await this.prismaService.user
      .findUnique({
        where: { id },
        include: UsersSelector.selectUser(),
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
        include: UsersSelector.selectUser(),
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

  async findPairs(id: string): Promise<UserAggregate[]> {
    const pairs = await this.prismaService.user.findMany({
      where: { pairFor: { some: { id } } },
      include: UsersSelector.selectUser(),
    });

    return pairs.map((pair) => {
      this.standardUser(pair);
      return this.getUserAggregate(pair);
    });
  }

  async findPictures(userId: string): Promise<PictureAggregate[]> {
    const pictures = await this.prismaService.picture.findMany({
      where: { userId },
    });

    return pictures.map((picture) =>
      PictureAggregate.create({
        ...picture,
        createdAt: picture.createdAt.toISOString(),
        updatedAt: picture.updatedAt.toISOString(),
      }),
    );
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

  async createPair(id: string, forId: string): Promise<UserAggregate> {
    const pair = await this.prismaService.user.update({
      where: { id: forId },
      data: {
        pairs: { connect: { id } },
      },
      include: UsersSelector.selectUser(),
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
      include: UsersSelector.selectUser(),
    });

    if (!sortedUser) {
      return null;
    }

    this.standardUser(sortedUser);

    return this.getUserAggregate(sortedUser);
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

  private getUserAggregate(user: PrismaUser): UserAggregate {
    return UserAggregate.create({
      ...user,
      updatedAt: user.updatedAt.toISOString(),
      createdAt: user.createdAt.toISOString(),
    });
  }

  private standardUser(user) {
    this.standardUserPrimitiveRelations(user);
    this.standardUserInterests(user);
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
