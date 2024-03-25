import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserAggregate } from 'apps/user/src/domain/user';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, UserAggregate | null>
{
  constructor(private readonly repository: UserRepository) {}

  execute(query: GetUserQuery): Promise<UserAggregate | null> {
    const { id } = query;

    return this.repository.findOne(id);
  }
}
