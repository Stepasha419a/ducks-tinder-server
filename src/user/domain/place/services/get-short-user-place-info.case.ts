import { Place, ShortUserPlaceInfo } from '../place.interface';

export interface GetShortUserPlaceInfo {
  getShortUserPlaceInfo(this: Place): Promise<ShortUserPlaceInfo>;
}

export async function GET_SHORT_USER_PLACE_INFO(
  this: Place,
): Promise<ShortUserPlaceInfo> {
  return {
    name: this.name,
  };
}
