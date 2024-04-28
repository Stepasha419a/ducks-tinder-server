import { PictureAggregate } from '../aggregate';
import { User } from '../user.interface';

export interface AddPicture {
  addPicture(picture: PictureAggregate): Promise<PictureAggregate>;
}

export async function ADD_PICTURE(
  this: User,
  picture: PictureAggregate,
): Promise<PictureAggregate> {
  this.pictures.push(picture);

  return picture;
}
