import { User } from '../user.interface';

export interface DecreasePictureOrder {
  decreasePictureOrder(pictureId: string): Promise<number>;
}

export async function DECREASE_PICTURE_ORDER(
  this: User,
  pictureId: string,
): Promise<number> {
  const picture = this.pictures.find((item) => item.id === pictureId);
  if (!picture) {
    return;
  }

  if (picture.order > 0) {
    return --picture.order;
  }
  return picture.order;
}
