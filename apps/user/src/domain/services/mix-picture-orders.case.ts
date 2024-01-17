import { User } from '../user.interface';
import { PictureValueObject } from '../value-object';

export interface MixPictureOrders {
  mixPictureOrders(newOrders: number[]): Promise<PictureValueObject[]>;
}

export async function MIX_PICTURE_ORDERS(
  this: User,
  newOrders: number[],
): Promise<PictureValueObject[]> {
  this.pictures = this.pictures.map((picture, i) => {
    picture.order = newOrders[i];
    return picture;
  });

  return this.pictures.map((picture) => PictureValueObject.create(picture));
}
