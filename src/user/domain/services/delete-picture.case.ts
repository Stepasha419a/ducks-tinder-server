import { User } from '../user.interface';

export interface DeletePicture {
  deletePicture(pictureId: string): Promise<boolean>;
}

export async function DELETE_PICTURE(
  this: User,
  pictureId: string,
): Promise<boolean> {
  const oldLength = this.pictures.length;
  this.pictures = this.pictures.filter((picture) => picture.id !== pictureId);

  return oldLength !== this.pictures.length;
}
