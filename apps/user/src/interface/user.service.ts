import { Injectable } from '@nestjs/common';
import { UserFacade } from '../application';

@Injectable()
export class UserService {
  constructor(private readonly facade: UserFacade) {}

  async getUser(id: string) {
    return this.facade.queries.getUser(id);
  }
}
