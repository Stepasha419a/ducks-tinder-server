import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatMemberQuery } from './get-chat-member.query';
import { ChatRepository } from 'src/domain/chat/repository';
import { NotFoundException } from '@nestjs/common';
import { ChatMemberView } from 'src/application/adapter/user-api/view';
import { UserApi } from 'src/application/adapter';

@QueryHandler(GetChatMemberQuery)
export class GetChatMemberQueryHandler
  implements IQueryHandler<GetChatMemberQuery, ChatMemberView>
{
  constructor(
    private readonly repository: ChatRepository,
    private readonly userApi: UserApi,
  ) {}

  async execute(query: GetChatMemberQuery): Promise<ChatMemberView> {
    const { memberId, userId } = query;

    const chat = await this.repository.findOneByUserIds([memberId, userId]);
    if (!chat) {
      throw new NotFoundException();
    }

    const member = await this.userApi.getChatMemberView(memberId);
    if (!member) {
      throw new NotFoundException();
    }

    return member;
  }
}
