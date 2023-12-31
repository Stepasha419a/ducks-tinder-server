import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMessagesQuery } from './get-messages.query';
import { Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { ChatRepository } from 'chat/application/repository';
import { ChatMessage, MessagesPaginationAggregate } from 'chat/domain';
import { UserService } from 'user/interface';

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler
  implements IQueryHandler<GetMessagesQuery>
{
  constructor(
    private readonly repository: ChatRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async execute(query: GetMessagesQuery): Promise<MessagesPaginationAggregate> {
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
    const shortUsers = await Promise.all(
      userIds.map(async (userId) => {
        const userAggregate = await this.userService.getUser(userId);
        return userAggregate.getShortUserWithDistance();
      }),
    );

    const messagesPaginationAggregate = MessagesPaginationAggregate.create({
      chatId: chat.id,
      messages,
      users: shortUsers,
    });

    return messagesPaginationAggregate;
  }

  private getUniqueUserIds(messages: ChatMessage[], currentUserId: string) {
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
