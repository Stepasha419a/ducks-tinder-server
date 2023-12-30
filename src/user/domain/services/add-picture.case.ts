import { PictureAggregate } from '../picture';
import { User } from '../user.interface';

export interface AddPicture {
  addPicture(picture: PictureAggregate): Promise<PictureAggregate>;
}

export async function ADD_PICTURE(
  this: User,
  picture: PictureAggregate,
): Promise<PictureAggregate> {
  const pictureInfo = await picture.getPicture();
  this.pictures.push(pictureInfo);

  return picture;
}
