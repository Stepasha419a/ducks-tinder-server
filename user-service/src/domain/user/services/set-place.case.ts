import { User } from '../user.interface';
import { PlaceEntity } from '../entity/place.entity';

export interface SetPlace {
  setPlace(placeValueObject: PlaceEntity): void;
}

export async function SET_PLACE(this: User, placeValueObject: PlaceEntity) {
  this.place = placeValueObject;
}
