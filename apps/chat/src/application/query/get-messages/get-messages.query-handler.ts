import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMessagesQuery } from './get-messages.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { Message } from 'apps/chat/src/domain';
import { MessagesPaginationValueObject } from 'apps/chat/src/domain/value-object';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@app/common/constants';
import { firstValueFrom } from 'rxjs';
import { UserAggregate } from 'apps/user/src/domain';

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler
  implements IQueryHandler<GetMessagesQuery>
{
  constructor(
    private readonly repository: ChatRepository,
    @Inject(SERVICES.USER) private readonly userClient: ClientProxy,
  ) {}

  async execute(
    query: GetMessagesQuery,
  ): Promise<MessagesPaginationValueObject> {
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

    const userIds = this.getUniqueUserIds(messages, userId);
    const users = await firstValueFrom<UserAggregate[]>(
      this.userClient.send('get_many_users', userIds),
    );

    const messagesPaginationAggregate = MessagesPaginationValueObject.create({
      chatId: chat.id,
      messages,
      users,
    });

    return messagesPaginationAggregate;
  }

  private getUniqueUserIds(messages: Message[], currentUserId: string) {
    const userIds = [];

    messages.forEach((message) => {
      if (
        !userIds.includes(message.userId) &&
        message.userId !== currentUserId
      ) {
        userIds.push(message.userId);
      }
    });

    return userIds;
  }
}
