import { BadRequestException } from '@nestjs/common';
import { IsLatitude, IsLongitude, validateSync } from 'class-validator';

export class GetCoordsGeocodeDto {
  constructor(dto: GetCoordsGeocodeDto) {
    this.latitude = dto.latitude;
    this.longitude = dto.longitude;

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
