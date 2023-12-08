import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';
import { PrismaService } from 'prisma/prisma.service';
import { RefreshToken, RefreshTokenAggregate } from 'tokens/domain';
import { Token } from '@prisma/client';

@Injectable()
export class RefreshTokenAdapter implements RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(refreshToken: RefreshToken): Promise<RefreshTokenAggregate> {
    const existingRefreshToken = await this.findOne(refreshToken.id);

    if (existingRefreshToken) {
      const { id, ...toUpdate } = refreshToken;
      const updatedRefreshToken = await this.prismaService.token.update({
        where: { id },
        data: toUpdate,
      });

      return this.getRefreshTokenAggregate(updatedRefreshToken);
    }

    const savedRefreshToken = await this.prismaService.token.create({
      data: refreshToken,
    });

    return this.getRefreshTokenAggregate(savedRefreshToken);
  }

  async findOne(id: string): Promise<RefreshTokenAggregate> {
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

  async findOneByValue(value: string): Promise<RefreshTokenAggregate> {
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

  async delete(id: string): Promise<boolean> {
    const deletedRefreshToken = await this.prismaService.token
      .delete({ where: { id } })
      .catch(() => {
        return false;
      });

    return Boolean(deletedRefreshToken);
  }

  private getRefreshTokenAggregate(refreshToken: Token): RefreshTokenAggregate {
    return RefreshTokenAggregate.create({
      ...refreshToken,
      updatedAt: refreshToken.updatedAt.toISOString(),
      createdAt: refreshToken.createdAt.toISOString(),
    });
  }
}
