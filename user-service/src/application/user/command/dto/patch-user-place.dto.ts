import { IsLatitude, IsLongitude } from 'class-validator';

export class PatchUserPlaceDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
