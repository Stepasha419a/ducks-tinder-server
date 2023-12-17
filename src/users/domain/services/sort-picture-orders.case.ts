import { PictureAggregate } from '../picture';
import { User } from '../user.interface';

export interface SortPictureOrders {
  sortPictureOrders(byOrder: number): Promise<PictureAggregate[]>;
}

export async function SORT_PICTURE_ORDERS(
  this: User,
  byOrder: number,
): Promise<PictureAggregate[]> {
  this.pictures = await Promise.all(
    this.pictures.map(async (picture) => {
      if (picture.order > byOrder) {
        const pictureAggregate = PictureAggregate.create(picture);
        pictureAggregate.decreaseOrder();
        picture = await pictureAggregate.getPicture();
      }
      return picture;
    }),
  );

  return this.pictures.map((picture) => PictureAggregate.create(picture));
}
