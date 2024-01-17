import { Injectable } from '@nestjs/common';
import { UserFacade } from 'apps/user/src/application';
import { CreateUserDto } from 'apps/user/src/application/command';

@Injectable()
export class UsersService {
  constructor(private readonly facade: UserFacade) {}

  async getUser(id: string) {
    return this.facade.queries.getUser(id);
  }

  async getUserByEmail(email: string) {
    return this.facade.queries.getUserByEmail(email);
  }

  async createUser(dto: CreateUserDto) {
    return this.facade.commands.createUser(dto);
  }
}
