import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMessagesQuery } from './get-messages.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { Message } from 'apps/chat/src/domain';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserAggregate } from 'apps/user/src/domain/user';
import { SERVICES } from '@app/common/shared/constant';
import { DataMessageView, MessagesPaginationView } from '../../views';

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

    const userIds = this.getUniqueUserIds(messages);
    const users = await firstValueFrom<UserAggregate[]>(
      this.userClient.send('get_many_users', userIds),
    );

    const dataMessages: DataMessageView[] = messages.map((message) => {
      const user = users.find((user) => user.id === message.userId);
      const avatar = user.pictures[0]?.name || null;
      return {
        ...message,
        avatar,
        name: user.name,
      };
    });

    const messagesPagination: MessagesPaginationView = {
      chatId: chat.id,
      messages: dataMessages,
    };

    return messagesPagination;
  }

  private getUniqueUserIds(messages: Message[]) {
    const userIds = [];

    messages.forEach((message) => {
      if (!userIds.includes(message.userId)) {
        userIds.push(message.userId);
      }
    });

    return userIds;
  }
}
