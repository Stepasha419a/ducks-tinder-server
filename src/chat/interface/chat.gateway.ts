import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserSocket } from 'common/types/user-socket';
import {
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsHttpExceptionFilter } from 'common/filters';
import { WsAccessTokenGuard, WsRefreshTokenGuard } from 'common/guards';
import { User } from 'common/decorators';
import { ChatFacade } from 'chat/application';
import { GetMessagesDto } from 'chat/application/query';
import { EditMessageDto, SendMessageDto } from 'chat/application/command';
import { ChatMapper } from 'chat/infrastructure/mapper';

@UseFilters(WsHttpExceptionFilter)
@UsePipes(ValidationPipe)
@WebSocketGateway({
  namespace: '/chat/socket',
  cors: { origin: true },
  cookie: true,
})
export class ChatGateway {
  constructor(
    private readonly facade: ChatFacade,
    private readonly mapper: ChatMapper,
  ) {}

  @WebSocketServer()
  wss: Server;

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('connect-chats')
  async handleConnectChats(
    @ConnectedSocket() client: UserSocket,
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
  ) {
    client.join(userId);

    client.emit('connect-chats');
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('connect-chat')
  async handleConnectChat(
    @ConnectedSocket() client: UserSocket,
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    await this.facade.queries.validateChatMember(userId, chatId);
    await this.facade.commands.saveLastSeen(userId, chatId);

    client.emit('connect-chat');
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('disconnect-chat')
  async handleDisconnectChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    await this.facade.commands.saveLastSeen(userId, chatId);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody() dto: SendMessageDto,
  ) {
    const message = await this.facade.commands.sendMessage(userId, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      dto.chatId,
    );

    this.wss.to(userIds).emit('send-message', message);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('get-messages')
  async getMessages(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody() dto: GetMessagesDto,
  ) {
    const data = await this.facade.queries.getMessages(userId, dto);

    this.wss
      .to(userId)
      .emit('get-messages', this.mapper.getShortMessagesPagination(data));
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('delete-message')
  async deleteMessage(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) messageId: string,
  ) {
    const message = await this.facade.commands.deleteMessage(userId, messageId);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      message.chatId,
    );

    this.wss.to(userIds).emit('delete-message', message);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('edit-message')
  async editMessage(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody() dto: EditMessageDto,
  ) {
    const message = await this.facade.commands.editMessage(userId, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      message.chatId,
    );

    this.wss.to(userIds).emit('edit-message', message);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('block-chat')
  async blockChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.blockChat(userId, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(userId, chat.id);

    this.wss.to(userIds).emit('block-chat', chat);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('unblock-chat')
  async unblockChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.unblockChat(userId, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(userId, chat.id);

    this.wss.to(userIds).emit('unblock-chat', chat);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('delete-chat')
  async deleteChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const userIds = await this.facade.queries.getChatMemberIds(userId, chatId);
    const chat = await this.facade.commands.deleteChat(userId, chatId);

    this.wss.to(userIds).emit('delete-chat', chat.id);
  }
}
