import { User } from '../user.interface';
import { PlaceAggregate } from '../place';

export interface SetPlace {
  setPlace(placeAggregate: PlaceAggregate): void;
}

export async function SET_PLACE(this: User, placeAggregate: PlaceAggregate) {
  this.place = await placeAggregate.getUserPlaceInfo();
}
