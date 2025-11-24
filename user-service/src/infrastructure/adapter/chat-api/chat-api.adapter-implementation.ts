import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ } from 'src/infrastructure/rabbitmq';
import { ChatApi } from 'src/application/user/adapter';
import { CreateChatDto } from 'src/application/user/adapter/chat-api/dto';

@Injectable()
export class ChatApiImplementation implements ChatApi {
  constructor(private readonly amqp: AmqpConnection) {}

  private readonly logger = new Logger(ChatApiImplementation.name);

  async createChat(dto: CreateChatDto) {
    try {
      await this.amqp.publish(
        RABBITMQ.CHAT.EXCHANGE,
        RABBITMQ.CHAT.EVENTS.CREATE_CHAT,
        dto,
      );
    } catch (error) {
      this.logger.error('Failed to send create chat event', error);

      throw error;
    }
  }
}
