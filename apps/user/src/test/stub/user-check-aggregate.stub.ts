import { UserCheckAggregate } from '../../domain/user/aggregate';
import { AggregateRootStub } from './aggregate-root.stub';

export const UserCheckAggregateStub = (): UserCheckAggregate =>
  ({
    checkedId: '2961e385-fcf1-4390-bb32-1904718ccdef',
    wasCheckedId: '1961e385-fcf1-4390-bb32-1904718ccdef',
    createdAt: new Date('01-01-2001').toISOString(),

    ...AggregateRootStub(),
  }) as UserCheckAggregate;
