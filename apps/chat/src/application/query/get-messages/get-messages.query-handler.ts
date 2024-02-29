import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMessagesQuery } from './get-messages.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@app/common/shared/constant';
import { MessagesPaginationView } from '../../views';

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler
  implements IQueryHandler<GetMessagesQuery>
{
  constructor(
    private readonly repository: ChatRepository,
    @Inject(SERVICES.USER) private readonly userClient: ClientProxy,
  ) {}

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
