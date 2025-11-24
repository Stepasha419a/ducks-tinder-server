import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ } from 'src/infrastructure/rabbitmq';
import { ChatApi } from 'src/application/user/adapter';
import { CreateChatDto } from 'src/application/user/adapter/chat-api/dto';

@Injectable()
export class ChatApiImplementation implements ChatApi {
  constructor(private readonly amqp: AmqpConnection) {}
}
