import { Place, UserPlaceInfo } from '../place.interface';

export interface GetUserPlaceInfo {
  getUserPlaceInfo(this: Place): Promise<UserPlaceInfo>;
}

export async function GET_USER_PLACE_INFO(this: Place): Promise<UserPlaceInfo> {
  return {
    latitude: this.latitude,
    longitude: this.longitude,
    address: this.address,
    name: this.name,
  };
}
