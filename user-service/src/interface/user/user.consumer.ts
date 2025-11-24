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
}
