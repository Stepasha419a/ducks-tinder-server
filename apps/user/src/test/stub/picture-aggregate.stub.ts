import { PictureAggregate } from '../../domain/user/aggregate';
import { UserStub } from './user-stub';
import { AggregateRootStub } from './aggregate-root.stub';

export const PictureAggregateStub = (): PictureAggregate =>
  ({
    id: '1961e385-fcf1-4390-bb32-1904718ccdef',
    name: 'russia moscow',
    userId: UserStub().id,
    order: 0,
    createdAt: new Date('01-01-2001').toISOString(),
    updatedAt: new Date('01-01-2001').toISOString(),

    ...AggregateRootStub(),
  }) as PictureAggregate;
