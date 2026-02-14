import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChatFacade } from 'src/application';
import { EditMessageDto, SendMessageDto } from 'src/application/command';
import { PaginationDto } from 'src/domain/chat/repository/dto';
import { User } from './common';

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
    const messages = await this.facade.queries.getMessages(userId, {
      ...query,
      chatId,
    });
    await this.facade.commands.saveLastSeen(userId, chatId);

    return messages;
  }

  @Get('member/:id')
  async getMember(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) memberId: string,
  ) {
    return this.facade.queries.getChatMember(userId, memberId);
  }
}
