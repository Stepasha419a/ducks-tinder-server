import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatMemberQuery } from './get-chat-member.query';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { SERVICES } from '@app/common/shared/constant';
import { ClientProxy } from '@nestjs/microservices';
import { ChatMemberView } from '../../view/chat-member.view';
import { firstValueFrom } from 'rxjs';

@QueryHandler(GetChatMemberQuery)
export class GetChatMemberQueryHandler
  implements IQueryHandler<GetChatMemberQuery, ChatMemberView>
{
  constructor(
    private readonly repository: ChatRepository,
    @Inject(SERVICES.USER) private readonly userClient: ClientProxy,
  ) {}

  async execute(query: GetChatMemberQuery): Promise<ChatMemberView> {
    const { memberId, userId } = query;

    const chat = await this.repository.findOneByUserIds([memberId, userId]);
    if (!chat) {
      throw new NotFoundException();
    }

    const member = await firstValueFrom<ChatMemberView>(
      this.userClient.send('get_short_user', memberId),
    );
    if (!member) {
      throw new NotFoundException();
    }

    return member;
  }
}
