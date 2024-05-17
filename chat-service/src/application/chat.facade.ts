import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  BlockChatCommand,
  CreateChatCommand,
  DeleteChatCommand,
  EditMessageCommand,
  EditMessageDto,
  SaveLastSeenCommand,
  SendMessageCommand,
  SendMessageDto,
  UnblockChatCommand,
} from './command';
import {
  GetChatMemberIdsQuery,
  GetChatMemberQuery,
  GetChatQuery,
  GetChatsQuery,
  GetMessagesDto,
  GetMessagesQuery,
  GetNewMessagesCountQuery,
  ValidateChatMemberQuery,
} from './query';
import { ChatAggregate, MessageAggregate } from 'src/domain';
import { DeleteMessageCommand } from './command/delete-message';
import { MessagesPaginationView, NewMessageView } from './view';
import { ChatMemberView } from './view/chat-member.view';
import { ChatPaginationEntity } from '../domain/entity';
import { PaginationDto } from 'src/domain/repository/dto';

@Injectable()
export class ChatFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    sendMessage: (
      userId: string,
      dto: SendMessageDto,
      notifyUserIds: string[],
    ) => this.sendMessage(userId, dto, notifyUserIds),
    editMessage: (userId: string, dto: EditMessageDto) =>
      this.editMessage(userId, dto),
    deleteMessage: (userId: string, messageId: string) =>
      this.deleteMessage(userId, messageId),
    blockChat: (userId: string, chatId: string) =>
      this.blockChat(userId, chatId),
    unblockChat: (userId: string, chatId: string) =>
      this.unblockChat(userId, chatId),
    saveLastSeen: (userId: string, chatId: string) =>
      this.saveLastSeen(userId, chatId),
    createChat: (memberIds: string[]) => this.createChat(memberIds),
    deleteChat: (userId: string, chatId: string) =>
      this.deleteChat(userId, chatId),
  };

  queries = {
    getChat: (userId: string, chatId: string) => this.getChat(userId, chatId),
    getChats: (userId: string, dto: PaginationDto) =>
      this.getChats(userId, dto),
    getMessages: (userId: string, dto: GetMessagesDto) =>
      this.getMessages(userId, dto),
    getNewMessagesCount: (userId: string) => this.getNewMessagesCount(userId),
    getChatMemberIds: (userId: string, chatId: string) =>
      this.getChatMemberIds(userId, chatId),
    getChatMember: (userId: string, memberId: string) =>
      this.getChatMember(userId, memberId),
    validateChatMember: (userId: string, chatId: string) =>
      this.validateChatMember(userId, chatId),
  };

  private sendMessage(
    userId: string,
    dto: SendMessageDto,
    notifyUserIds: string[],
  ) {
    return this.commandBus.execute<SendMessageCommand, NewMessageView>(
      new SendMessageCommand(userId, dto, notifyUserIds),
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

  private saveLastSeen(userId: string, chatId: string) {
    return this.commandBus.execute<SaveLastSeenCommand>(
      new SaveLastSeenCommand(userId, chatId),
    );
  }

  private createChat(memberIds: string[]) {
    return this.commandBus.execute<CreateChatCommand>(
      new CreateChatCommand(memberIds),
    );
  }

  private deleteChat(userId: string, chatId: string) {
    return this.commandBus.execute<DeleteChatCommand, ChatAggregate>(
      new DeleteChatCommand(userId, chatId),
    );
  }

  private getChat(userId: string, chatId: string) {
    return this.queryBus.execute<GetChatQuery, ChatPaginationEntity>(
      new GetChatQuery(userId, chatId),
    );
  }

  private getChats(userId: string, dto: PaginationDto) {
    return this.queryBus.execute<GetChatsQuery, ChatPaginationEntity[]>(
      new GetChatsQuery(userId, dto),
    );
  }

  private getMessages(userId: string, dto: GetMessagesDto) {
    return this.queryBus.execute<GetMessagesQuery, MessagesPaginationView>(
      new GetMessagesQuery(userId, dto),
    );
  }

  private getNewMessagesCount(userId: string) {
    return this.queryBus.execute<GetNewMessagesCountQuery, number>(
      new GetNewMessagesCountQuery(userId),
    );
  }

  private getChatMemberIds(userId: string, chatId: string) {
    return this.queryBus.execute<GetChatMemberIdsQuery, string[]>(
      new GetChatMemberIdsQuery(userId, chatId),
    );
  }

  private getChatMember(userId: string, memberId: string) {
    return this.queryBus.execute<GetChatMemberQuery, ChatMemberView>(
      new GetChatMemberQuery(userId, memberId),
    );
  }

  private validateChatMember(userId: string, chatId: string) {
    return this.queryBus.execute<ValidateChatMemberQuery>(
      new ValidateChatMemberQuery(userId, chatId),
    );
  }
}
