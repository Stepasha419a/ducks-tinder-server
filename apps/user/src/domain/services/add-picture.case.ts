import { User } from '../user.interface';
import { PictureValueObject } from '../value-object';

export interface AddPicture {
  addPicture(picture: PictureValueObject): Promise<PictureValueObject>;
}

export async function ADD_PICTURE(
  this: User,
  picture: PictureValueObject,
): Promise<PictureValueObject> {
  this.pictures.push(picture);

  return picture;
}
