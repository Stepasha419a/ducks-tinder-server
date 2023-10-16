import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserAggregate } from 'users/domain';
import { UserRepository } from 'users/providers';
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

    /* const user = await this.prismaService.user.create({
      data: dto,
      include: UsersSelector.selectUser(),
    });

    const pairsCount = await this.prismaService.user.count({
      where: { pairFor: { some: { email: dto.email } } },
    });

    return new UserDto({ ...user, pairsCount }); */
  }
}
