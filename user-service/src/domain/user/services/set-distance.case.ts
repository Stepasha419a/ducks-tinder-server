import { User } from '../user.interface';

export interface SetDistance {
  setDistance(distance: number): void;
}

export async function SET_DISTANCE(this: User, distance: number) {
  this.distance = distance;
}
