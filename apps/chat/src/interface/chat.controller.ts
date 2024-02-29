import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { User } from '@app/common/shared/decorator';
import { ChatFacade } from 'apps/chat/src/application';
import { PaginationDto } from '@app/common/shared/dto';
import {
  EditMessageDto,
  SendMessageDto,
} from 'apps/chat/src/application/command';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('chat')
export class ChatController {
  constructor(private readonly facade: ChatFacade) {}

  @Get()
  async getChats(
    @User(ParseUUIDPipe) userId: string,
    @Query()
    query: PaginationDto,
  ) {
    return this.facade.queries.getChats(userId, query);
  }

  @Get(':id/messages')
  async getMessages(
    @User(ParseUUIDPipe) userId: string,
    @Query()
    query: PaginationDto,
    @Param('id', ParseUUIDPipe) chatId: string,
  ) {
    return this.facade.queries.getMessages(userId, { ...query, chatId });
  }

  @Post('TEST/message')
  async sendMessage(
    @User(ParseUUIDPipe) userId: string,
    @Body() dto: SendMessageDto,
  ) {
    const message = await this.facade.commands.sendMessage(userId, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      userId,
      dto.chatId,
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

  @EventPattern('create_chat')
  createChat(@Payload() memberIds: string[]) {
    this.facade.commands.createChat(memberIds);
  }
}
