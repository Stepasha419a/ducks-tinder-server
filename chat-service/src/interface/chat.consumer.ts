import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ChatFacade } from 'src/application';
import { CreateChatDto } from 'src/application/command';
import { RABBITMQ } from 'src/infrastructure/rabbitmq';

@Injectable()
export class ChatConsumer {
  constructor(private readonly facade: ChatFacade) {}

  private readonly logger = new Logger(ChatConsumer.name);

  @RabbitSubscribe({
    exchange: RABBITMQ.CHAT.EXCHANGE,
    routingKey: RABBITMQ.CHAT.EVENTS.CREATE_CHAT,
    queue: RABBITMQ.CHAT.QUEUE,
  })
  public async handleCreateChatEvent(message: CreateChatDto) {
    this.logger.log(
      'Received message',
      RABBITMQ.CHAT.EVENTS.CREATE_CHAT,
      message,
    );

    try {
      await this.facade.commands.createChat(message);
    } catch (error) {
      this.logger.error('Failed to create chat', error);

      throw error;
    }
  }
}
