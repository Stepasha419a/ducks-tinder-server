import { Injectable, Logger } from '@nestjs/common';
import { UserApi } from 'src/application/adapter';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ChatMemberView } from 'src/application/adapter/user-api/view';
import { ChatConsumer } from 'src/interface';
import { RABBITMQ } from 'src/infrastructure/rabbitmq';

@Injectable()
export class UserApiImplementation implements UserApi {
  constructor(private readonly amqp: AmqpConnection) {}
}
