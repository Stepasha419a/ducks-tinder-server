import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@app/common/database';
import { Token } from '@prisma/client';
import { TokenRepository } from 'apps/user/src/domain/token/repository';
import { RefreshTokenEntity } from 'apps/user/src/domain/token';

@Injectable()
export class TokenAdapter implements TokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async saveRefreshToken(
    refreshToken: RefreshTokenEntity,
  ): Promise<RefreshTokenEntity> {
    const existingRefreshToken = await this.findOneRefreshToken(
      refreshToken.id,
    );

    if (existingRefreshToken) {
      const { id, ...toUpdate } = refreshToken;
      const updatedRefreshToken = await this.databaseService.token.update({
        where: { id },
        data: {
          refreshToken: toUpdate.value,
          updatedAt: new Date().toISOString(),
        },
      });

      return this.getRefreshTokenEntity(updatedRefreshToken);
    }

    const savedRefreshToken = await this.databaseService.token.create({
      data: {
        id: refreshToken.id,
        refreshToken: refreshToken.value,
        createdAt: refreshToken.createdAt,
        updatedAt: refreshToken.updatedAt,
      },
    });

    return this.getRefreshTokenEntity(savedRefreshToken);
  }

  async findOneRefreshToken(id: string): Promise<RefreshTokenEntity | null> {
    const existingRefreshToken = await this.databaseService.token
      .findUnique({
        where: { id },
      })
      .catch(() => {
        return null;
      });

    if (!existingRefreshToken) {
      return null;
    }

    return this.getRefreshTokenEntity(existingRefreshToken);
  }

  async findOneRefreshTokenByValue(value: string): Promise<RefreshTokenEntity> {
    const existingRefreshToken = await this.databaseService.token
      .findUnique({
        where: { refreshToken: value },
      })
      .catch(() => {
        return null;
      });

    if (!existingRefreshToken) {
      return null;
    }

    return this.getRefreshTokenEntity(existingRefreshToken);
  }

  async deleteRefreshToken(id: string): Promise<boolean> {
    const deletedRefreshToken = await this.databaseService.token
      .delete({ where: { id } })
      .catch(() => {
        return false;
      });

    return Boolean(deletedRefreshToken);
  }

  private getRefreshTokenEntity(refreshToken: Token): RefreshTokenEntity {
    return RefreshTokenEntity.create({
      ...refreshToken,
      value: refreshToken.refreshToken,
      updatedAt: refreshToken.updatedAt.toISOString(),
      createdAt: refreshToken.createdAt.toISOString(),
    });
  }
}
