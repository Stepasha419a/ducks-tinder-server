import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from 'common/decorators';
import { CustomValidationPipe } from 'common/pipes';
import { ValidatedUserDto } from 'user/legacy/dto';
import { ChatFacade } from './application-services';
import { PaginationDto } from 'libs/shared/dto';
import { GetMessagesDto } from './application-services/queries';
import {
  EditMessageDto,
  SendMessageDto,
} from './application-services/commands';

@Controller('chats')
export class ChatsController {
  constructor(private readonly facade: ChatFacade) {}

  @Get()
  getChats(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Body() dto: PaginationDto,
  ) {
    return this.facade.queries.getChats(user.id, dto);
  }

  @Get('TEST/messages')
  getMessages(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Body() dto: GetMessagesDto,
  ) {
    return this.facade.queries.getMessages(user.id, dto);
  }

  @Post('TEST/message')
  async sendMessage(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Body() dto: SendMessageDto,
  ) {
    const message = await this.facade.commands.sendMessage(user.id, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      dto.chatId,
    );

    return { message, userIds };
  }

  @Patch('TEST/message')
  async editMessage(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Body() dto: EditMessageDto,
  ) {
    const message = await this.facade.commands.editMessage(user.id, dto);
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      message.chatId,
    );

    return { message, userIds };
  }

  @Delete('TEST/message/:id')
  async deleteMessage(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) messageId: string,
  ) {
    const message = await this.facade.commands.deleteMessage(
      user.id,
      messageId,
    );
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      message.chatId,
    );

    return { message, userIds };
  }

  @Patch('TEST/chat/block/:id')
  async blockChat(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.blockChat(user.id, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      chat.id,
    );

    return { chat, userIds };
  }

  @Patch('TEST/chat/unblock/:id')
  async unblockChat(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const chat = await this.facade.commands.unblockChat(user.id, chatId);
    const userIds = await this.facade.queries.getChatMemberIds(
      user.id,
      chat.id,
    );

    return { chat, userIds };
  }

  @Delete('TEST/chat/:id')
  async deleteChat(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) chatId: string,
  ) {
    const userIds = await this.facade.queries.getChatMemberIds(user.id, chatId);
    const chat = await this.facade.commands.deleteChat(user.id, chatId);

    return { chat, userIds };
  }
}
