import { PictureEntity } from '../entity';
import { User } from '../user.interface';

export interface SortPictureOrders {
  sortPictureOrders(byOrder: number): Promise<PictureEntity[]>;
}

export async function SORT_PICTURE_ORDERS(
  this: User,
  byOrder: number,
): Promise<PictureEntity[]> {
  this.pictures = this.pictures.map((picture) => {
    if (picture.order > byOrder) {
      --picture.order;
    }
    return picture;
  });

  return this.pictures.map((picture) => PictureEntity.create(picture));
}
