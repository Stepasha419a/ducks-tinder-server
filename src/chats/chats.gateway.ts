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
import { CustomValidationPipe } from 'common/pipes';
import { ValidatedUserDto } from 'user/legacy/dto';
import { ChatFacade } from './application-services';
import { GetMessagesDto } from './application-services/queries';
import {
  EditMessageDto,
  SendMessageDto,
} from './application-services/commands';

@UseFilters(WsHttpExceptionFilter)
@UsePipes(ValidationPipe)
@WebSocketGateway({
  namespace: '/chat/socket',
  cors: { origin: true },
  cookie: true,
})
export class ChatsGateway {
  constructor(private readonly facade: ChatFacade) {}

  @WebSocketServer()
  wss: Server;

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('connect-chats')
  async handleConnectChats(
    @ConnectedSocket() client: UserSocket,
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
  ) {
    client.join(user.id);

    client.emit('connect-chats');
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('connect-chat')
  async handleConnectChat(
    @ConnectedSocket() client: UserSocket,
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    await this.facade.queries.validateChatMember(user.id, chatId);
    await this.facade.commands.saveLastSeen(user.id, chatId);

    client.emit('connect-chat');
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('disconnect-chat')
  async handleDisconnectChat(
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    await this.facade.commands.saveLastSeen(user.id, chatId);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody() dto: SendMessageDto,
  ) {
    const message = await this.facade.commands.sendMessage(user.id, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      dto.chatId,
    );

    this.wss.to(userIds).emit('send-message', message);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('get-messages')
  async getMessages(
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody() dto: GetMessagesDto,
  ) {
    const data = await this.facade.queries.getMessages(user.id, dto);

    this.wss.to(user.id).emit('get-messages', data);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('delete-message')
  async deleteMessage(
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) messageId: string,
  ) {
    const message = await this.facade.commands.deleteMessage(
      user.id,
      messageId,
    );
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      message.chatId,
    );

    this.wss.to(userIds).emit('delete-message', message);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('edit-message')
  async editMessage(
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody() dto: EditMessageDto,
  ) {
    const message = await this.facade.commands.editMessage(user.id, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      message.chatId,
    );

    this.wss.to(userIds).emit('edit-message', message);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('block-chat')
  async blockChat(
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.blockChat(user.id, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      chat.id,
    );

    this.wss.to(userIds).emit('block-chat', chat);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('unblock-chat')
  async unblockChat(
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.unblockChat(user.id, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      chat.id,
    );

    this.wss.to(userIds).emit('unblock-chat', chat);
  }

  @UseGuards(WsRefreshTokenGuard)
  @SubscribeMessage('delete-chat')
  async deleteChat(
    @User({ isSocket: true }, CustomValidationPipe) user: ValidatedUserDto,
    @MessageBody('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const userIds = await this.facade.queries.getChatMemberIds(user.id, chatId);
    const chat = await this.facade.commands.deleteChat(user.id, chatId);

    this.wss.to(userIds).emit('delete-chat', chat.id);
  }
}
