import { Injectable, Logger } from '@nestjs/common';
import { UserApi } from 'src/application/adapter';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ChatMemberView } from 'src/application/adapter/user-api/view';
import { ChatConsumer } from 'src/interface';
import { RABBITMQ } from 'src/infrastructure/rabbitmq';

@Injectable()
export class UserApiImplementation implements UserApi {
  constructor(private readonly amqp: AmqpConnection) {}

  private readonly logger = new Logger(ChatConsumer.name);

  async getChatMemberView(userId: string): Promise<ChatMemberView> {
    try {
      const view = await this.amqp.request<ChatMemberView>({
        exchange: RABBITMQ.USER.EXCHANGE,
        routingKey: RABBITMQ.USER.EVENTS.GET_SHORT_USER,
        payload: userId,
      });

      return view;
    } catch (error) {
      this.logger.error('Failed to get chat member view', error);

      throw error;
    }
  }
}
