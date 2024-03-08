import { PictureValueObject } from 'apps/user/src/domain/user/value-object';

export interface PairsInfoView {
  count: number;
  picture: PictureValueObject | null;
}
