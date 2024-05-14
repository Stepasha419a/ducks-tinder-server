import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetManyUsersQuery } from './get-many-users.query';
import { UserAggregate } from 'user-service/src/domain/user';
import { UserRepository } from 'user-service/src/domain/user/repository';

@QueryHandler(GetManyUsersQuery)
export class GetManyUsersQueryHandler
  implements IQueryHandler<GetManyUsersQuery, UserAggregate[]>
{
  constructor(private readonly repository: UserRepository) {}

  execute(query: GetManyUsersQuery): Promise<UserAggregate[]> {
    const { ids } = query;

    return this.repository.findMany(ids);
  }
}
