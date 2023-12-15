import { Picture, UserPictureInfo } from '../picture.interface';

export interface GetUserPictureInfo {
  getUserPictureInfo(): Promise<UserPictureInfo>;
}

export async function GET_USER_PICTURE_INFO(
  this: Picture,
): Promise<UserPictureInfo> {
  return {
    name: this.name,
    order: this.order,
  };
}
