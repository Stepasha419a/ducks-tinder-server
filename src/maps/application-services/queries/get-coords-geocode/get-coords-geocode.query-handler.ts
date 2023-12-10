import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCoordsGeocodeQuery } from './get-coords-geocode.query';
import { Geocode } from 'maps/domain';
import { MapApi } from 'maps/providers';

@QueryHandler(GetCoordsGeocodeQuery)
export class GetCoordsGeocodeQueryHandler
  implements IQueryHandler<GetCoordsGeocodeQuery>
{
  constructor(private readonly api: MapApi) {}

  async execute(query: GetCoordsGeocodeQuery): Promise<Geocode> {
    const { dto } = query;

    const geocodeAggregate = await this.api.getGeocode(
      dto.latitude,
      dto.longitude,
    );

    return geocodeAggregate.getGeocode();
  }
}
