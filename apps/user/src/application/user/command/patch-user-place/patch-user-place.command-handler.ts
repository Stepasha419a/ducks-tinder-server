import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchUserPlaceCommand } from './patch-user-place.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserAggregate } from 'apps/user/src/domain/user';
import { MapApi } from 'apps/user/src/application/user/adapter';
import { PlaceEntity } from 'apps/user/src/domain/user/entity';

@CommandHandler(PatchUserPlaceCommand)
export class PatchUserPlaceCommandHandler
  implements ICommandHandler<PatchUserPlaceCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly mapApi: MapApi,
  ) {}

  async execute(command: PatchUserPlaceCommand): Promise<UserAggregate> {
    const { userId, dto } = command;

    const existingUser = await this.repository.findOne(userId);

    const geocode = await this.mapApi.getGeocode(dto.latitude, dto.longitude);

    existingUser.setPlace(
      PlaceEntity.create({
        id: userId,
        address: geocode.address,
        name: geocode.name,
        latitude: dto.latitude,
        longitude: dto.longitude,
      }),
    );

    const updatedUser = await this.repository.save(existingUser);

    return updatedUser;
  }
}
