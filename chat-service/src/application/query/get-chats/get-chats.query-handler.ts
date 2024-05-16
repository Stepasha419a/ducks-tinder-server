import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatsQuery } from './get-chats.query';
import { ChatRepository } from 'src/domain/repository';
import { ChatPaginationEntity } from 'src/domain/entity';

@QueryHandler(GetChatsQuery)
export class GetChatsQueryHandler implements IQueryHandler<GetChatsQuery> {
  constructor(private readonly repository: ChatRepository) {}

  async execute(query: GetChatsQuery): Promise<ChatPaginationEntity[]> {
    const { userId, dto } = query;

    const paginationChatAggregates = await this.repository.findMany(
      userId,
      dto,
    );

    return paginationChatAggregates;
  }
}
