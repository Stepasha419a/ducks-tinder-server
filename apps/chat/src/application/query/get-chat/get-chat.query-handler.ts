import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatQuery } from './get-chat.query';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { NotFoundException } from '@nestjs/common';
import { ChatPaginationEntity } from 'apps/chat/src/domain/entity';

@QueryHandler(GetChatQuery)
export class GetChatQueryHandler implements IQueryHandler<GetChatQuery> {
  constructor(private readonly repository: ChatRepository) {}

  async execute(query: GetChatQuery): Promise<ChatPaginationEntity> {
    const { userId, chatId } = query;

    const chatPagination = await this.repository.findOnePaginationHavingMember(
      chatId,
      userId,
    );

    if (!chatPagination) {
      throw new NotFoundException();
    }

    return chatPagination;
  }
}
