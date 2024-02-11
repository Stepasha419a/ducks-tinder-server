import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@app/common/database';
import { Token } from '@prisma/client';
import { TokenRepository } from 'apps/user/src/domain/token/repository';
import { RefreshTokenValueObject } from 'apps/user/src/domain/token';

@Injectable()
export class TokenAdapter implements TokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async saveRefreshToken(
    refreshToken: RefreshTokenValueObject,
  ): Promise<RefreshTokenValueObject> {
    const existingRefreshToken = await this.findOneRefreshToken(
      refreshToken.id,
    );

    if (existingRefreshToken) {
      const { id, ...toUpdate } = refreshToken;
      const updatedRefreshToken = await this.databaseService.token.update({
        where: { id },
        data: {
          refreshToken: toUpdate.value,
          createdAt: toUpdate.createdAt,
          updatedAt: toUpdate.updatedAt,
        },
      });

      return this.getRefreshTokenValueObject(updatedRefreshToken);
    }

    const savedRefreshToken = await this.databaseService.token.create({
      data: {
        id: refreshToken.id,
        refreshToken: refreshToken.value,
        createdAt: refreshToken.createdAt,
        updatedAt: refreshToken.updatedAt,
      },
    });

    return this.getRefreshTokenValueObject(savedRefreshToken);
  }

  async findOneRefreshToken(
    id: string,
  ): Promise<RefreshTokenValueObject | null> {
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

    return this.getRefreshTokenValueObject(existingRefreshToken);
  }

  async findOneRefreshTokenByValue(
    value: string,
  ): Promise<RefreshTokenValueObject> {
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

    return this.getRefreshTokenValueObject(existingRefreshToken);
  }

  async deleteRefreshToken(id: string): Promise<boolean> {
    const deletedRefreshToken = await this.databaseService.token
      .delete({ where: { id } })
      .catch(() => {
        return false;
      });

    return Boolean(deletedRefreshToken);
  }

  private getRefreshTokenValueObject(
    refreshToken: Token,
  ): RefreshTokenValueObject {
    return RefreshTokenValueObject.create({
      ...refreshToken,
      value: refreshToken.refreshToken,
      updatedAt: refreshToken.updatedAt.toISOString(),
      createdAt: refreshToken.createdAt.toISOString(),
    });
  }
}
