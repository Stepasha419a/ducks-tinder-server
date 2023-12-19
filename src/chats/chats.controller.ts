import { Body, Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetChatQuery } from './legacy/queries';
import { User } from 'common/decorators';
import { CustomValidationPipe } from 'common/pipes';
import { ValidatedUserDto } from 'users/legacy/dto';
import { ChatFacade } from './application-services';
import { PaginationDto } from 'libs/shared/dto';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly facade: ChatFacade,
  ) {}

  @Get()
  getChats(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Body() dto: PaginationDto,
  ) {
    return this.facade.queries.getChats(user.id, dto);
  }

  @Get(':id')
  getChat(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id') id: string,
  ) {
    return this.queryBus.execute(new GetChatQuery(user, id));
  }
}
