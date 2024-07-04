import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserAggregate } from 'src/domain/user';
import { UserRepository } from 'src/domain/user/repository';
import { COMMON_ERROR } from 'src/application/common';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserAggregate> {
    const { dto } = command;

    const candidate = await this.userRepository.findOne(dto.id);

    if (candidate) {
      throw new BadRequestException(COMMON_ERROR.USER_ALREADY_EXISTS);
    }

    const user = UserAggregate.create(dto);

    const savedUser = await this.userRepository.save(user).catch((err) => {
      throw new InternalServerErrorException(err);
    });

    return savedUser;
  }
}
