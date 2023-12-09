import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchUserCommand } from './patch-user.command';
import { ForbiddenException } from '@nestjs/common';
import { USER_ALREADY_EXISTS } from 'common/constants/error';
import { UserRepository } from 'users/providers';
import { UserAggregate } from 'users/domain';

@CommandHandler(PatchUserCommand)
export class PatchUserCommandHandler
  implements ICommandHandler<PatchUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: PatchUserCommand): Promise<UserAggregate> {
    const { userId, dto } = command;

    const existingUser = await this.repository.findOne(userId);

    if (dto.email) {
      const candidate = await this.repository.findOneByEmail(dto.email);
      if (candidate) {
        throw new ForbiddenException(USER_ALREADY_EXISTS);
      }
    }

    Object.assign(existingUser, dto);

    const updatedUser = await this.repository.save(existingUser);

    return updatedUser;
  }
}
