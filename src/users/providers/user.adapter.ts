import { Injectable, Logger } from '@nestjs/common';
import { User as PrismaUser } from 'prisma';
import { PrismaService } from 'prisma/prisma.service';
import { UserRepository } from './user.repository';
import { User, UserAggregate } from 'users/domain';
import { UsersSelector } from 'users/users.selector';
import { Prisma } from '@prisma/client';
import { PictureAggregate } from 'users/domain/user.aggregate';

@Injectable()
export class UserAdapter implements UserRepository {
  private readonly logger = new Logger(UserAdapter.name);
  constructor(private readonly prismaService: PrismaService) {}

  async save(user: UserAggregate): Promise<UserAggregate | null> {
    const existingUser = await this.findOne(user.id);
    if (existingUser) {
      const differentKeys = this.getDifferences(user, existingUser);
      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: this.getUserAggregateToUpdate(user, existingUser, differentKeys),
        include: UsersSelector.selectUser(),
      });

      return this.getUserAggregate(updatedUser);
    }

    const saved = await this.prismaService.user.create({
      data: { email: user.email, name: user.name, password: user.password },
      include: UsersSelector.selectUser(),
    });

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
    const primitiveRelationKeysToUpdate =
      this.getPrimitiveRelationKeysToUpdate(differentKeys);

    const primitiveRelationFieldsToUpdate =
      this.getPrimitiveRelationFieldsToUpdate(
        user,
        primitiveRelationKeysToUpdate,
      );

    const picturesToUpdate = this.getPicturesToUpdate(
      user,
      existingUser,
      differentKeys,
    );

    return {
      ...user.getPrimitiveFields(),
      ...primitiveRelationFieldsToUpdate,
      ...picturesToUpdate,
      place: {},
      interests: {},
    };
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

  private getPrimitiveRelationFieldsToUpdate(
    user: User,
    primitiveRelationKeysToUpdate?: Array<keyof User>,
  ) {
    const res = {};
    if (!primitiveRelationKeysToUpdate.length) {
      return res;
    }

    for (const key of primitiveRelationKeysToUpdate) {
      res[key] = this.getUserNamePropertyUpdate(user[key] as string);
    }
  }

  private getDifferences(oldUser, newUser) {
    const keysToUpdate = [];
    for (const key in newUser) {
      if (oldUser[key] !== newUser[key]) {
        keysToUpdate.push(key);
      } else if (
        typeof oldUser[key] === 'object' &&
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

  private getUserNamePropertyUpdate(value: string) {
    const operation = value ? 'connect' : 'disconnect';
    return {
      [operation]: { name: value },
    };
  }

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

    return this.getUserAggregate(existingUser);
  }

  async findMany(): Promise<[UserAggregate[], number]> {
    throw new Error('Method not implemented.');
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
}
