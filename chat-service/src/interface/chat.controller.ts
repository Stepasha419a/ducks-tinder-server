import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChatFacade } from 'src/application';
import { EditMessageDto, SendMessageDto } from 'src/application/command';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ChatControllerEvent } from './chat.controller-event';
import { PaginationDto } from 'src/domain/chat/repository/dto';
import { User, Util } from './common';

@Controller('chat')
export class ChatController {
  constructor(private readonly facade: ChatFacade) {}

  private readonly logger = new Logger(ChatController.name);

  @Get()
  async getChats(
    @User(ParseUUIDPipe) userId: string,
    @Query()
    query: PaginationDto,
  ) {
    return this.facade.queries.getChats(userId, query);
  }

  @Get('new')
  async getNewMessagesCount(@User(ParseUUIDPipe) userId: string) {
    return this.facade.queries.getNewMessagesCount(userId);
  }

  @Get(':id')
  async getChat(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) chatId: string,
  ) {
    return this.facade.queries.getChat(userId, chatId);
  }

  @Get(':id/messages')
  async getMessages(
    @User(ParseUUIDPipe) userId: string,
    @Query()
    query: PaginationDto,
    @Param('id', ParseUUIDPipe) chatId: string,
  ) {
    await this.facade.commands.saveLastSeen(userId, chatId);
    return this.facade.queries.getMessages(userId, { ...query, chatId });
  }

  @Get('member/:id')
  async getMember(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) memberId: string,
  ) {
    return this.facade.queries.getChatMember(userId, memberId);
  }

  @Post('TEST/message')
  async sendMessage(
    @User(ParseUUIDPipe) userId: string,
    @Body() dto: SendMessageDto,
  ) {
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      dto.chatId,
    );
    const message = await this.facade.commands.sendMessage(
      userId,
      dto,
      userIds,
    );

    return { message, userIds };
  }

  @Patch('TEST/message')
  async editMessage(
    @User(ParseUUIDPipe) userId: string,
    @Body() dto: EditMessageDto,
  ) {
    const message = await this.facade.commands.editMessage(userId, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      message.chatId,
    );

    return { message, userIds };
  }

  @Delete('TEST/message/:id')
  async deleteMessage(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) messageId: string,
  ) {
    const message = await this.facade.commands.deleteMessage(userId, messageId);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      message.chatId,
    );

    return { message, userIds };
  }

  @Patch('TEST/chat/block/:id')
  async blockChat(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.blockChat(userId, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(userId, chat.id);

    return { chat, userIds };
  }

  @Patch('TEST/chat/unblock/:id')
  async unblockChat(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.unblockChat(userId, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(userId, chat.id);

    return { chat, userIds };
  }

  @Delete('TEST/chat/:id')
  async deleteChat(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const userIds = await this.facade.queries.getChatMemberIds(userId, chatId);
    const chat = await this.facade.commands.deleteChat(userId, chatId);

    return { chat, userIds };
  }

  @EventPattern(ChatControllerEvent.CreateChat)
  createChat(@Payload() memberIds: string[], @Ctx() context: RmqContext) {
    this.facade.commands
      .createChat(memberIds)
      .then(() => {
        Util.ackMessage(context);
      })
      .catch((err: HttpException) => {
        this.logger.error(err, err.stack);

        if (err.message === 'Chat already exists') {
          Util.ackMessage(context);
        }
      });
  }
}
