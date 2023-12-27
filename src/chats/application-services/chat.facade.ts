import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  BlockChatCommand,
  CreateChatCommand,
  EditMessageCommand,
  EditMessageDto,
  SendMessageCommand,
  SendMessageDto,
  UnblockChatCommand,
} from './commands';
import { PaginationDto } from 'libs/shared/dto';
import {
  GetChatMemberIdsQuery,
  GetChatsQuery,
  GetMessagesDto,
  GetMessagesQuery,
} from './queries';
import {
  ChatAggregate,
  MessageAggregate,
  MessagesPaginationAggregate,
  PaginationChatAggregate,
} from 'chats/domain';
import { DeleteMessageCommand } from './commands/delete-message';

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
    editMessage: (userId: string, dto: EditMessageDto) =>
      this.editMessage(userId, dto),
    deleteMessage: (userId: string, messageId: string) =>
      this.deleteMessage(userId, messageId),
    blockChat: (userId: string, chatId: string) =>
      this.blockChat(userId, chatId),
    unblockChat: (userId: string, chatId: string) =>
      this.unblockChat(userId, chatId),
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

  private editMessage(userId: string, dto: EditMessageDto) {
    return this.commandBus.execute<EditMessageCommand, MessageAggregate>(
      new EditMessageCommand(userId, dto),
    );
  }

  private deleteMessage(userId: string, messageId: string) {
    return this.commandBus.execute<DeleteMessageCommand, MessageAggregate>(
      new DeleteMessageCommand(userId, messageId),
    );
  }

  private blockChat(userId: string, chatId: string) {
    return this.commandBus.execute<BlockChatCommand, ChatAggregate>(
      new BlockChatCommand(userId, chatId),
    );
  }

  private unblockChat(userId: string, chatId: string) {
    return this.commandBus.execute<UnblockChatCommand, ChatAggregate>(
      new UnblockChatCommand(userId, chatId),
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
