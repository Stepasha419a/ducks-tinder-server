import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MixPicturesCommand } from './mix-pictures.command';
import { UserRepository } from 'user-service/src/domain/user/repository';
import { UserAggregate } from 'user-service/src/domain/user';

@CommandHandler(MixPicturesCommand)
export class MixPicturesCommandHandler
  implements ICommandHandler<MixPicturesCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: MixPicturesCommand): Promise<UserAggregate> {
    const { userId, dto } = command;

    const userAggregate = await this.repository.findOne(userId);

    if (dto.pictureOrders.length !== userAggregate.pictures.length) {
      throw new NotFoundException();
    }

    await userAggregate.mixPictureOrders(dto.pictureOrders);

    const savedUser = await this.repository.save(userAggregate);

    return savedUser;
  }
}
