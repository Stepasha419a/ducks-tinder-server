import { PictureAggregate } from 'apps/user/src/domain/user/aggregate';

export interface PairsInfoView {
  count: number;
  picture: PictureAggregate | null;
}
