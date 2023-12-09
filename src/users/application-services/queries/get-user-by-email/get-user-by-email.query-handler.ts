import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from './get-user-by-email.query';
import { UserRepository } from 'users/providers';
import { UserAggregate } from 'users/domain';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: GetUserByEmailQuery): Promise<UserAggregate | null> {
    const { email } = command;

    const userAggregate = await this.repository.findOneByEmail(email);

    return userAggregate;
  }
}
