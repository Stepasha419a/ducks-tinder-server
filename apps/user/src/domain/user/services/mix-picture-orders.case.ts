import { PictureEntity } from '../entity';
import { User } from '../user.interface';

export interface MixPictureOrders {
  mixPictureOrders(newOrders: number[]): Promise<PictureEntity[]>;
}

export async function MIX_PICTURE_ORDERS(
  this: User,
  newOrders: number[],
): Promise<PictureEntity[]> {
  this.pictures = this.pictures.map((picture, i) => {
    picture.order = newOrders[i];
    return picture;
  });

  return this.pictures.map((picture) => PictureEntity.create(picture));
}
