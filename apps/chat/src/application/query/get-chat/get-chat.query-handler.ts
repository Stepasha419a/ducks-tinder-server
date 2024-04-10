import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatQuery } from './get-chat.query';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { ChatPaginationValueObject } from 'apps/chat/src/domain/value-object';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetChatQuery)
export class GetChatQueryHandler implements IQueryHandler<GetChatQuery> {
  constructor(private readonly repository: ChatRepository) {}

  async execute(query: GetChatQuery): Promise<ChatPaginationValueObject> {
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
