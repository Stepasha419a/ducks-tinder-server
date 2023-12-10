export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;

  createdAt: string;
  updatedAt: string;
}

export interface UserPlaceInfo {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}
