import { AcceptPairEvent } from 'user/domain/event';
import { UserAggregate } from '../user.aggregate';

export interface AcceptPair {
  acceptPair(pairId: string): Promise<void>;
}

export async function ACCEPT_PAIR(this: UserAggregate, pairId: string) {
  this.apply(new AcceptPairEvent(this.id, pairId));
}
