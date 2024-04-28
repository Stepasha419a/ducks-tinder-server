import { PictureEntity } from '../entity';
import { User } from '../user.interface';

export interface AddPicture {
  addPicture(picture: PictureEntity): Promise<PictureEntity>;
}

export async function ADD_PICTURE(
  this: User,
  picture: PictureEntity,
): Promise<PictureEntity> {
  this.pictures.push(picture);

  return picture;
}
