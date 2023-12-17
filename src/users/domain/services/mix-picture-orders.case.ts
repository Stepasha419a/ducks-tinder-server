import { PictureAggregate } from '../picture';
import { User } from '../user.interface';

export interface MixPictureOrders {
  mixPictureOrders(newOrders: number[]): Promise<PictureAggregate[]>;
}

export async function MIX_PICTURE_ORDERS(
  this: User,
  newOrders: number[],
): Promise<PictureAggregate[]> {
  this.pictures = this.pictures.map((picture, i) => {
    picture.order = newOrders[i];
    return picture;
  });

  return this.pictures.map((picture) => PictureAggregate.create(picture));
}
