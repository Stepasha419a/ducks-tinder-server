import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { UserFacade } from 'src/application/user';
import { CreateUserDto } from 'src/application/user/command';
import { RABBITMQ } from 'src/infrastructure/rabbitmq';
import { UserMapper } from 'src/infrastructure/user/mapper';

@Injectable()
export class UserConsumer {
  constructor(
    private readonly facade: UserFacade,
    private readonly mapper: UserMapper,
  ) {}

  private readonly logger = new Logger(UserConsumer.name);

  @RabbitRPC({
    exchange: RABBITMQ.USER.EXCHANGE,
    routingKey: RABBITMQ.USER.EVENTS.GET_SHORT_USER,
    queue: RABBITMQ.USER.QUEUE,
  })
  public async handleGetShortUserEvent(userId: string) {
    this.logger.log(
      'Received message',
      RABBITMQ.USER.EVENTS.GET_SHORT_USER,
      userId,
    );

    try {
      const user = await this.facade.queries.getUser(userId);

      return this.mapper.getShortUser(user);
    } catch (error) {
      this.logger.error('Failed to get short user', error);

      throw error;
    }
  }

  @RabbitSubscribe({
    exchange: RABBITMQ.USER.EXCHANGE,
    routingKey: RABBITMQ.USER.EVENTS.CREATE_USER,
    queue: RABBITMQ.USER.QUEUE,
  })
  public async handleCreateUserEvent(dto: CreateUserDto) {
    this.logger.log('Received message', RABBITMQ.USER.EVENTS.CREATE_USER, dto);

    try {
      const savedUser = await this.facade.commands.createUser(dto);

      return this.mapper.getShortUser(savedUser);
    } catch (error) {
      this.logger.error('Failed to create user', error);

      throw error;
    }
  }
}
