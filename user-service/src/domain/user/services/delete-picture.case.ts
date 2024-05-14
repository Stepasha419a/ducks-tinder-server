import { User } from '../user.interface';

export interface DeletePicture {
  deletePicture(pictureId: string): Promise<boolean>;
}

export async function DELETE_PICTURE(
  this: User,
  pictureId: string,
): Promise<boolean> {
  const oldLength = this.pictures.length;

  const picture = this.pictures.find((item) => item.id === pictureId);
  if (!picture) {
    return false;
  }

  this.pictures = this.pictures
    .filter((item) => item.id !== pictureId)
    .map((item) => {
      if (item.order > picture.order) {
        --item.order;
      }
      return item;
    });

  return oldLength !== this.pictures.length;
}
