import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserFacade } from '../application';
import { CreateUserDto } from '../application/command';

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
}
