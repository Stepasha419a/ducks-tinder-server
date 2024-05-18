import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMessagesQuery } from './get-messages.query';
import { NotFoundException } from '@nestjs/common';
import { ChatRepository } from 'src/domain/repository';
import { MessagesPaginationView } from '../../view';

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler
  implements IQueryHandler<GetMessagesQuery>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(query: GetMessagesQuery): Promise<MessagesPaginationView> {
    const { userId, dto } = query;

    const chat = await this.repository.findOneHavingMember(dto.chatId, userId);
    if (!chat) {
      throw new NotFoundException();
    }

    const messagesCount = await this.repository.findMessagesCount(chat.id);

    if (dto.skip > messagesCount) {
      throw new NotFoundException();
    }

    const messages = await this.repository.findMessages(chat.id, dto);

    const messagesPagination: MessagesPaginationView = {
      chatId: chat.id,
      messages,
    };

    return messagesPagination;
  }
}
