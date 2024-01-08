import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateChatMemberQuery } from './validate-chat-member.query';
import { ChatRepository } from 'chat/domain/repository';

@QueryHandler(ValidateChatMemberQuery)
export class ValidateChatMemberQueryHandler
  implements IQueryHandler<ValidateChatMemberQuery>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(query: ValidateChatMemberQuery): Promise<void> {
    const { userId, chatId } = query;

    const chat = await this.repository.findOneHavingMember(chatId, userId);
    if (!chat) {
      throw new NotFoundException();
    }
  }
}
