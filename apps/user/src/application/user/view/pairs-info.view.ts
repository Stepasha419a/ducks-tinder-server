import { PictureEntity } from 'apps/user/src/domain/user/entity';

export interface PairsInfoView {
  count: number;
  picture: PictureEntity | null;
}
