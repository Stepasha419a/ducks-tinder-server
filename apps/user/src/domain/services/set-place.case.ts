import { User } from '../user.interface';
import { PlaceValueObject } from '../value-object/place.value-object';

export interface SetPlace {
  setPlace(placeValueObject: PlaceValueObject): void;
}

export async function SET_PLACE(
  this: User,
  placeValueObject: PlaceValueObject,
) {
  this.place = placeValueObject;
}
