import { User } from '../user.interface';
import { PictureValueObject } from '../value-object';

export interface SortPictureOrders {
  sortPictureOrders(byOrder: number): Promise<PictureValueObject[]>;
}

export async function SORT_PICTURE_ORDERS(
  this: User,
  byOrder: number,
): Promise<PictureValueObject[]> {
  this.pictures = this.pictures.map((picture) => {
    if (picture.order > byOrder) {
      --picture.order;
    }
    return picture;
  });

  return this.pictures.map((picture) => PictureValueObject.create(picture));
}
