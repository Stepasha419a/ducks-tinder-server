import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateChatCommand,
  SendMessageCommand,
  SendMessageDto,
} from './commands';
import { PaginationDto } from 'libs/shared/dto';
import {
  GetChatMemberIdsQuery,
  GetChatsQuery,
  GetMessagesDto,
  GetMessagesQuery,
} from './queries';
import {
  MessageAggregate,
  MessagesPaginationAggregate,
  PaginationChatAggregate,
} from 'chats/domain';

@Injectable()
export class ChatFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createChat: (memberIds: string[]) => this.createChat(memberIds),
    sendMessage: (userId: string, dto: SendMessageDto) =>
      this.sendMessage(userId, dto),
  };

  queries = {
    getChats: (userId: string, dto: PaginationDto) =>
      this.getChats(userId, dto),
    getMessages: (userId: string, dto: GetMessagesDto) =>
      this.getMessages(userId, dto),
    getChatMemberIds: (userId: string, chatId: string) =>
      this.getChatMemberIds(userId, chatId),
  };

  private createChat(memberIds: string[]) {
    return this.commandBus.execute<CreateChatCommand>(
      new CreateChatCommand(memberIds),
    );
  }

  private sendMessage(userId: string, dto: SendMessageDto) {
    return this.commandBus.execute<SendMessageCommand, MessageAggregate>(
      new SendMessageCommand(userId, dto),
    );
  }

  private getChats(userId: string, dto: PaginationDto) {
    return this.queryBus.execute<GetChatsQuery, PaginationChatAggregate[]>(
      new GetChatsQuery(userId, dto),
    );
  }

  private getMessages(userId: string, dto: GetMessagesDto) {
    return this.queryBus.execute<GetMessagesQuery, MessagesPaginationAggregate>(
      new GetMessagesQuery(userId, dto),
    );
  }

  private getChatMemberIds(userId: string, chatId: string) {
    return this.queryBus.execute<GetChatMemberIdsQuery, string[]>(
      new GetChatMemberIdsQuery(userId, chatId),
    );
  }
}
