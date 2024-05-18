import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';

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
