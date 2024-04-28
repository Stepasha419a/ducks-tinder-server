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

  /* idk how it works but browser maps api returns lat and long but geocode api requires
   them on the contrary for correct geocode answer & distance formula requires them on the
   contrary => I swap them when save in db */
  async execute(command: PatchUserPlaceCommand): Promise<UserAggregate> {
    const { userId, dto } = command;

    const existingUser = await this.repository.findOne(userId);

    const geocode = await this.mapApi.getGeocode(dto.latitude, dto.longitude);

    existingUser.setPlace(
      PlaceEntity.create({
        id: userId,
        address: geocode.address,
        name: geocode.name,
        latitude: dto.longitude,
        longitude: dto.latitude,
      }),
    );

    const updatedUser = await this.repository.save(existingUser);

    return updatedUser;
  }
}
