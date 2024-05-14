import { PictureEntity } from 'user-service/src/domain/user/entity';

export interface PairsInfoView {
  count: number;
  picture: PictureEntity | null;
}
