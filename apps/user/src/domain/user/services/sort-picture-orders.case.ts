import { PictureAggregate } from '../aggregate';
import { User } from '../user.interface';

export interface SortPictureOrders {
  sortPictureOrders(byOrder: number): Promise<PictureAggregate[]>;
}

export async function SORT_PICTURE_ORDERS(
  this: User,
  byOrder: number,
): Promise<PictureAggregate[]> {
  this.pictures = this.pictures.map((picture) => {
    if (picture.order > byOrder) {
      --picture.order;
    }
    return picture;
  });

  return this.pictures.map((picture) => PictureAggregate.create(picture));
}
