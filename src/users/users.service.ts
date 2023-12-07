import { Injectable } from '@nestjs/common';
import { UserFacade } from './application-services';
import { CreateUserDto } from './application-services/commands';

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
