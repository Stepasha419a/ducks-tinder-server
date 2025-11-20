import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatFacade } from 'src/application';
import { CreateChatDto } from 'src/application/command';
import { RABBITMQ } from 'src/infrastructure/rabbitmq';

@Injectable()
export class ChatConsumer {
  constructor(private readonly facade: ChatFacade) {}
}
