import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserFacade } from '../application';
import { CreateUserDto, UserTokenDto } from '../application/command';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserFacade)) private readonly facade: UserFacade,
  ) {}

  async getUser(id: string) {
    return this.facade.queries.getUser(id);
  }

  async getUserByEmail(email: string) {
    return this.facade.queries.getUserByEmail(email);
  }

  async createUser(dto: CreateUserDto) {
    return this.facade.commands.createUser(dto);
  }

  public async generateTokens(dto: UserTokenDto) {
    return this.facade.commands.generateTokens(dto);
  }

  public async removeToken(refreshTokenValue: string) {
    return this.facade.commands.removeToken(refreshTokenValue);
  }

  public async validateRefreshToken(refreshTokenValue: string) {
    return this.facade.commands.validateRefreshToken(refreshTokenValue);
  }

  public validateAccessToken(accessTokenValue: string) {
    return this.facade.commands.validateAccessToken(accessTokenValue);
  }
}
