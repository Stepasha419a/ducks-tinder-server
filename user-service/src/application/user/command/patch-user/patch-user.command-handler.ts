import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchUserCommand } from './patch-user.command';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';

@CommandHandler(PatchUserCommand)
export class PatchUserCommandHandler
  implements ICommandHandler<PatchUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: PatchUserCommand): Promise<UserAggregate> {
    const { userId, dto } = command;

    const existingUser = await this.repository.findOne(userId);

    Object.assign(existingUser, dto);

    const updatedUser = await this.repository.save(existingUser);

    return updatedUser;
  }
}
