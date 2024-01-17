import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { UserAggregate } from 'apps/user/src/domain';
import { UserRepository } from 'apps/user/src/domain/repository';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, UserAggregate>
{
  private readonly logger = new Logger(GetUserQueryHandler.name);
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetUserQuery): Promise<UserAggregate | null> {
    const { id } = query;

    const existingUser = await this.repository.findOne(id).catch((err) => {
      this.logger.error(err);
      return null as UserAggregate;
    });

    return existingUser;
  }
}
