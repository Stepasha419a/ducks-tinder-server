import { PictureEntity } from 'src/domain/user/entity';

export interface PairsInfoView {
  count: number;
  picture: PictureEntity | null;
}
