import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatMemberQuery } from './get-chat-member.query';
import { ChatRepository } from 'src/domain/chat/repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChatMemberView } from '../../view/chat-member.view';
import { firstValueFrom } from 'rxjs';
import { SERVICE } from 'src/infrastructure/rabbitmq/service/service';

@QueryHandler(GetChatMemberQuery)
export class GetChatMemberQueryHandler
  implements IQueryHandler<GetChatMemberQuery, ChatMemberView>
{
  constructor(
    private readonly repository: ChatRepository,
    @Inject(SERVICE.USER) private readonly userClient: ClientProxy,
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
