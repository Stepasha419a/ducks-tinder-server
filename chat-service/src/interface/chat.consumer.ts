import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ChatFacade } from 'src/application';
import { CreateChatDto } from 'src/application/command';
import { RABBITMQ } from 'src/infrastructure/rabbitmq';

@Injectable()
export class ChatConsumer {
  constructor(private readonly facade: ChatFacade) {}
  @RabbitSubscribe({
    exchange: RABBITMQ.CHAT.EXCHANGE,
    routingKey: RABBITMQ.CHAT.EVENTS.CREATE_CHAT,
    queue: RABBITMQ.CHAT.QUEUE,
  })
  public async handleCreateChatEvent(message: CreateChatDto) {
    try {
      await this.facade.commands.createChat(message);
    } catch (error) {
      throw error;
    }
  }
}
