import { UserStub } from './user-stub';
import { PictureEntity } from '../../domain/user/entity';

export const PictureEntityStub = (): PictureEntity => ({
  id: '1961e385-fcf1-4390-bb32-1904718ccdef',
  name: 'russia moscow',
  userId: UserStub().id,
  order: 0,
  createdAt: new Date('01-01-2001').toISOString(),
  updatedAt: new Date('01-01-2001').toISOString(),
});
