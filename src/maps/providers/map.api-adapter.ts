import { Injectable, NotFoundException } from '@nestjs/common';
import { MapApi } from './map.api';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GeocodeAggregate } from 'maps/domain';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class MapApiAdapter implements MapApi {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getGeocode(
    latitude: number,
    longitude: number,
  ): Promise<GeocodeAggregate> {
    const response = await lastValueFrom(
      this.httpService
        .get(
          `${this.configService.get<string>(
            'GEOCODE_API_URL',
          )}?apikey=${this.configService.get<string>(
            'GEOCODE_API_KEY',
          )}&geocode=${latitude},${longitude}&results=1&format=json&lang=en_US`,
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

    return GeocodeAggregate.create({ address, name });
  }
}
