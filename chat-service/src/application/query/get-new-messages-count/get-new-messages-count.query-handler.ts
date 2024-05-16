import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNewMessagesCountQuery } from './get-new-messages-count.query';
import { ChatRepository } from 'src/domain/repository';

@QueryHandler(GetNewMessagesCountQuery)
export class GetNewMessagesCountQueryHandler
  implements IQueryHandler<GetNewMessagesCountQuery, number>
{
  constructor(private readonly repository: ChatRepository) {}

  execute(query: GetNewMessagesCountQuery): Promise<number> {
    const { userId } = query;

    return this.repository.findNewMessagesCount(userId);
  }
}
