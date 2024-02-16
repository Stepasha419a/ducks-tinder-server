import { PictureValueObject } from '../../domain/user/value-object';
import { UserStub } from '../stub/user-stub';

export const PictureValueObjectStub = (): PictureValueObject => ({
  id: '1961e385-fcf1-4390-bb32-1904718ccdef',
  name: 'russia moscow',
  userId: UserStub().id,
  order: 0,
  createdAt: new Date('01-01-2001').toISOString(),
  updatedAt: new Date('01-01-2001').toISOString(),
});
