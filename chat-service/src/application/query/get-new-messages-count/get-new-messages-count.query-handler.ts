import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNewMessagesCountQuery } from './get-new-messages-count.query';
import { ChatRepository } from 'src/domain/chat/repository';
import { NewMessagesCountView } from 'src/application/view';

@QueryHandler(GetNewMessagesCountQuery)
export class GetNewMessagesCountQueryHandler
  implements IQueryHandler<GetNewMessagesCountQuery, NewMessagesCountView>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(
    query: GetNewMessagesCountQuery,
  ): Promise<NewMessagesCountView> {
    const { userId } = query;

    const count = await this.repository.findNewMessagesCount(userId);

    return {
      count,
    };
  }
}
