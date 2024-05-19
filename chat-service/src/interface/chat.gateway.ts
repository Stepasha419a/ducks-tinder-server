import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatFacade } from 'src/application';
import { EditMessageDto, SendMessageDto } from 'src/application/command';
import { ChatGatewayEvent } from './chat.gateway-event';
import { WsHttpExceptionFilter } from './filter';
import { AccessTokenGuard } from './guard';
import { User } from './decorator';

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
  @SubscribeMessage(ChatGatewayEvent.Connect)
  async handleConnectChats(
    @ConnectedSocket() client: Socket,
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
  ) {
    client.join(userId);

    client.emit(ChatGatewayEvent.Connect);
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage(ChatGatewayEvent.ConnectChat)
  async handleConnectChat(
    @ConnectedSocket() client: Socket,
    @User({ isSocket: true }, new ParseUUIDPipe({ version: '4' }))
    userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    await this.facade.queries.validateChatMember(userId, chatId);
    await this.facade.commands.saveLastSeen(userId, chatId);

    client.emit(ChatGatewayEvent.ConnectChat);
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage(ChatGatewayEvent.DisconnectChat)
  async handleDisconnectChat(
    @ConnectedSocket() client: Socket,
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    await this.facade.queries.validateChatMember(userId, chatId);
    await this.facade.commands.saveLastSeen(userId, chatId);

    client.emit(ChatGatewayEvent.DisconnectChat);
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage(ChatGatewayEvent.SendMessage)
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
      this.wss.to(userId).emit(ChatGatewayEvent.SendMessage, {
        newMessagesCount: userNewMessagesCount[userId] ?? 0,
        message,
      });
    });
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage(ChatGatewayEvent.DeleteMessage)
  async deleteMessage(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) messageId: string,
  ) {
    const message = await this.facade.commands.deleteMessage(userId, messageId);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      message.chatId,
    );

    this.wss.to(userIds).emit(ChatGatewayEvent.DeleteMessage, message);
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage(ChatGatewayEvent.EditMessage)
  async editMessage(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody() dto: EditMessageDto,
  ) {
    const message = await this.facade.commands.editMessage(userId, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      message.chatId,
    );

    this.wss.to(userIds).emit(ChatGatewayEvent.EditMessage, message);
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage(ChatGatewayEvent.BlockChat)
  async blockChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.blockChat(userId, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(userId, chat.id);

    this.wss.to(userIds).emit(ChatGatewayEvent.BlockChat, chat);
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage(ChatGatewayEvent.UnblockChat)
  async unblockChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.unblockChat(userId, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(userId, chat.id);

    this.wss.to(userIds).emit(ChatGatewayEvent.UnblockChat, chat);
  }

  @UseGuards(AccessTokenGuard)
  @SubscribeMessage(ChatGatewayEvent.DeleteChat)
  async deleteChat(
    @User({ isSocket: true }, ParseUUIDPipe) userId: string,
    @MessageBody(new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const userIds = await this.facade.queries.getChatMemberIds(userId, chatId);
    const chat = await this.facade.commands.deleteChat(userId, chatId);

    this.wss.to(userIds).emit(ChatGatewayEvent.DeleteChat, chat.id);
  }
}
