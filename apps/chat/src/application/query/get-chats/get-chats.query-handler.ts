import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatsQuery } from './get-chats.query';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { ChatPaginationValueObject } from 'apps/chat/src/domain/value-object';

@QueryHandler(GetChatsQuery)
export class GetChatsQueryHandler implements IQueryHandler<GetChatsQuery> {
  constructor(private readonly repository: ChatRepository) {}

  async execute(query: GetChatsQuery): Promise<ChatPaginationValueObject[]> {
    const { userId, dto } = query;

    const paginationChatAggregates = await this.repository.findMany(
      userId,
      dto,
    );

    return paginationChatAggregates;
  }
}
