import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchUserCommand } from './patch-user.command';
import { Logger, NotFoundException } from '@nestjs/common';
import { UserAggregate } from 'users/domain';
import { UserRepository } from 'users/providers';

@CommandHandler(PatchUserCommand)
export class PatchUserCommandHandler
  implements ICommandHandler<PatchUserCommand, UserAggregate>
{
  private readonly logger = new Logger(PatchUserCommandHandler.name);
  constructor(private readonly repository: UserRepository) {}

  async execute(command: PatchUserCommand): Promise<UserAggregate> {
    const { dto } = command;

    const existingUser = await this.repository.findOne(dto.id).catch((err) => {
      this.logger.error(err);
      return null as UserAggregate;
    });

    if (!existingUser) {
      throw new NotFoundException();
    }

    Object.assign(existingUser, dto);

    const userAggregate = UserAggregate.create(existingUser);

    await this.repository.save(userAggregate);
    return userAggregate;
  }
}
