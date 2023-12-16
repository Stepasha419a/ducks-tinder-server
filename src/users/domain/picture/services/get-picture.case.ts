import { Picture } from '../picture.interface';

export interface GetPicture {
  getPicture(): Promise<Picture>;
}

export async function GET_PICTURE(this: Picture): Promise<Picture> {
  return {
    id: this.id,
    userId: this.userId,
    name: this.name,
    order: this.order,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
}
