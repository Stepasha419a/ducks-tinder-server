import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCoordsGeocodeQuery } from './get-coords-geocode.query';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { GeocodeView } from 'apps/user/src/application/user/adapter';

@QueryHandler(GetCoordsGeocodeQuery)
export class GetCoordsGeocodeQueryHandler
  implements IQueryHandler<GetCoordsGeocodeQuery>
{
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: GetCoordsGeocodeQuery): Promise<GeocodeView> {
    const { dto } = query;

    const response = await lastValueFrom(
      this.httpService
        .get(
          `${this.configService.get<string>(
            'GEOCODE_API_URL',
          )}?apikey=${this.configService.get<string>(
            'GEOCODE_API_KEY',
          )}&geocode=${dto.longitude},${
            dto.latitude
          }&results=1&format=json&lang=en_US`,
        )
        .pipe(map((res) => res.data)),
    );

    const address =
      response?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject
        ?.name;
    const name =
      response?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject
        ?.description;

    if (!address || !name) {
      throw new NotFoundException();
    }

    return { address, name };
  }
}
