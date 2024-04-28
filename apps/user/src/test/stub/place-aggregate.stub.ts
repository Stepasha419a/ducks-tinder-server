import { PlaceAggregate } from '../../domain/user/aggregate';
import { UserStub } from '../stub/user-stub';
import { AggregateRootStub } from './aggregate-root.stub';

export const PlaceAggregateStub = (): PlaceAggregate =>
  ({
    id: UserStub().id,
    name: 'russia moscow',
    address: 'place-address',
    latitude: 12.345678,
    longitude: 23.456789,
    createdAt: new Date('01-01-2001').toISOString(),
    updatedAt: new Date('01-01-2001').toISOString(),

    ...AggregateRootStub(),
  }) as PlaceAggregate;
