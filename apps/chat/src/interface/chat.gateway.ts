import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserSocket } from '@app/common/types/user-socket';
import {
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsHttpExceptionFilter } from '@app/common/shared/filter';
import { AccessTokenGuard, RefreshTokenGuard } from '@app/common/auth/guard';
import { User } from '@app/common/shared/decorator';
import { ChatFacade } from 'apps/chat/src/application';
import {
  EditMessageDto,
  SendMessageDto,
} from 'apps/chat/src/application/command';

@UseFilters(WsHttpExceptionFilter)
@UsePipes(ValidationPipe)
@WebSocketGateway({
  namespace: '/chat/socket',
  cors: { origin: true },
  cookie: true,
})
export class ChatGateway {
  constructor(private readonly facade: ChatFacade) {}

  @WebSocketServer()
  wss: Server;

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage('connect-chats')
  async handleConnectChats(
    @ConnectedSocket() client: UserSocket,
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
  ) {
    client.join(userId);

    client.emit('connect-chats');
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage('connect-chat')
  async handleConnectChat(
    @ConnectedSocket() client: UserSocket,
    @User({ isSocket: true }, new ParseUUIDPipe({ version: '4' }))
    userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    await this.facade.queries.validateChatMember(userId, chatId);
    await this.facade.commands.saveLastSeen(userId, chatId);

    client.emit('connect-chat');
  }

  @UseGuards(RefreshTokenGuard)
  @SubscribeMessage('disconnect-chat')
  async handleDisconnectChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    await this.facade.commands.saveLastSeen(userId, chatId);
  }

  @UseGuards(RefreshTokenGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody() dto: SendMessageDto,
  ) {
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      dto.chatId,
    );
    const { message, userNewMessagesCount } =
      await this.facade.commands.sendMessage(userId, dto, userIds);

    userIds.forEach((userId) => {
      this.wss.to(userId).emit('send-message', {
        newMessagesCount: userNewMessagesCount[userId] ?? 0,
        message,
      });
    });
  }

  @UseGuards(RefreshTokenGuard)
  @SubscribeMessage('delete-message')
  async deleteMessage(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) messageId: string,
  ) {
    const message = await this.facade.commands.deleteMessage(userId, messageId);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      message.chatId,
    );

    this.wss.to(userIds).emit('delete-message', message);
  }

  @UseGuards(RefreshTokenGuard)
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

  @UseGuards(RefreshTokenGuard)
  @SubscribeMessage('block-chat')
  async blockChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.blockChat(userId, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(userId, chat.id);

    this.wss.to(userIds).emit('block-chat', chat);
  }

  @UseGuards(RefreshTokenGuard)
  @SubscribeMessage('unblock-chat')
  async unblockChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.unblockChat(userId, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(userId, chat.id);

    this.wss.to(userIds).emit('unblock-chat', chat);
  }

  @UseGuards(RefreshTokenGuard)
  @SubscribeMessage('delete-chat')
  async deleteChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const userIds = await this.facade.queries.getChatMemberIds(userId, chatId);
    const chat = await this.facade.commands.deleteChat(userId, chatId);

    this.wss.to(userIds).emit('delete-chat', chat.id);
  }
}
