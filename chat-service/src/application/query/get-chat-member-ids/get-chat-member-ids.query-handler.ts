import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatMemberIdsQuery } from './get-chat-member-ids.query';
import { ChatRepository } from 'src/domain/repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetChatMemberIdsQuery)
export class GetChatMemberIdsQueryHandler
  implements IQueryHandler<GetChatMemberIdsQuery>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(query: GetChatMemberIdsQuery): Promise<string[]> {
    const { chatId, userId } = query;

    const userIds = await this.repository.findChatUserIds(chatId);
    if (!userIds.length || !userIds.includes(userId)) {
      throw new NotFoundException();
    }

    return userIds;
  }
}
