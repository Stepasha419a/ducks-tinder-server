import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChatCommand } from './commands';
import { PaginationDto } from 'libs/shared/dto';
import { GetChatsQuery } from './queries';
import { PaginationChatAggregate } from 'chats/domain';

@Injectable()
export class ChatFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createChat: (memberIds: string[]) => this.createChat(memberIds),
  };

  queries = {
    getChats: (userId: string, dto: PaginationDto) =>
      this.getChats(userId, dto),
  };

  private createChat(memberIds: string[]) {
    return this.commandBus.execute<CreateChatCommand>(
      new CreateChatCommand(memberIds),
    );
  }

  private getChats(userId: string, dto: PaginationDto) {
    return this.queryBus.execute<GetChatsQuery, PaginationChatAggregate[]>(
      new GetChatsQuery(userId, dto),
    );
  }
}
