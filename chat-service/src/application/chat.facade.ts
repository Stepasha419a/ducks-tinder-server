import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  BlockChatCommand,
  CreateChatCommand,
  CreateChatDto,
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
import { ChatAggregate, MessageAggregate } from 'src/domain/chat';
import { DeleteMessageCommand } from './command/delete-message';
import {
  MessagesPaginationView,
  NewMessageView,
  NewMessagesCountView,
} from './view';
import { ChatPaginationEntity } from '../domain/chat/entity';
import { PaginationDto } from 'src/domain/chat/repository/dto';
import { ChatMemberView } from './adapter/user-api/view';

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
    createChat: (dto: CreateChatDto) => this.createChat(dto),
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

  private createChat(dto: CreateChatDto) {
    return this.commandBus.execute<CreateChatCommand>(
      new CreateChatCommand(dto),
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
    return this.queryBus.execute<
      GetNewMessagesCountQuery,
      NewMessagesCountView
    >(new GetNewMessagesCountQuery(userId));
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
