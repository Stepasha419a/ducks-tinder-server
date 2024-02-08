import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserAggregate } from 'apps/user/src/domain/user';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, UserAggregate>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserAggregate> {
    const { dto } = command;

    const userAggregate = UserAggregate.create(dto);
    const createdUser = await this.repository
      .save(userAggregate)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return createdUser;
  }
}
