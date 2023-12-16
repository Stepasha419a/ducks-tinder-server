import { PictureAggregate } from '../picture';
import { User } from '../user.interface';

export interface SortPictureOrders {
  sortPictureOrders(byOrder: number): Promise<PictureAggregate[]>;
}

export async function SORT_PICTURE_ORDERS(
  this: User,
  byOrder: number,
): Promise<PictureAggregate[]> {
  for (let i = 0; i < this.pictures.length; i++) {
    let picture = this.pictures[i];
    if (picture.order > byOrder) {
      const pictureAggregate = PictureAggregate.create(picture);
      pictureAggregate.decreaseOrder();
      picture = await pictureAggregate.getPicture();
    }
  }

  return this.pictures.map((picture) => PictureAggregate.create(picture));
}
