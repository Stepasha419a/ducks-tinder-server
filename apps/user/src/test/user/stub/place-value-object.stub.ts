import { PlaceValueObject } from '../../../domain/user/value-object';
import { UserStub } from './user-stub';

export const PlaceValueObjectStub = (): PlaceValueObject => ({
  id: UserStub().id,
  name: 'russia moscow',
  address: 'place-address',
  latitude: 12.345678,
  longitude: 23.456789,
  createdAt: new Date('01-01-2001').toISOString(),
  updatedAt: new Date('01-01-2001').toISOString(),
});
