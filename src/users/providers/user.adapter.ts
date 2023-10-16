import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User as PrismaUser } from 'prisma';
import { PrismaService } from 'prisma/prisma.service';
import { UserRepository } from './user.repository';
import { User, UserAggregate } from 'users/domain';

@Injectable()
export class UserAdapter implements UserRepository {
  private readonly logger = new Logger(UserAdapter.name);
  constructor(private readonly prismaService: PrismaService) {}

  async save(user: User): Promise<UserAggregate | null> {
    if (user?.id) {
      const existingUser = await this.findOne(user.id);
      if (!existingUser) {
        throw new NotFoundException();
      }

      const { id, ...toUpdate } = user;
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: toUpdate,
      });

      return this.getUserAggregate(updatedUser);
    }

    const saved = await this.prismaService.user.create({ data: user });
    return this.getUserAggregate(saved);
  }

  async findOne(id: string): Promise<UserAggregate | null> {
    const existingUser = await this.prismaService.user
      .findUnique({
        where: { id },
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!existingUser) {
      throw new NotFoundException();
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
