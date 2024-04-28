import { User } from '../user.interface';
import { PlaceAggregate } from '../aggregate/place.aggregate';

export interface SetPlace {
  setPlace(placeValueObject: PlaceAggregate): void;
}

export async function SET_PLACE(this: User, placeValueObject: PlaceAggregate) {
  this.place = placeValueObject;
}
