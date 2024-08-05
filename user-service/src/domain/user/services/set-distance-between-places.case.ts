import { User } from '../user.interface';
import { PlaceEntity } from '../entity';

export interface SetDistanceBetweenPlaces {
  setDistanceBetweenPlaces(place?: PlaceEntity): void;
}

export async function SET_DISTANCE_BETWEEN_PLACES(
  this: User,
  place?: PlaceEntity,
) {
  if (!this.place || !place) {
    this.distance = null;
    return;
  }

  this.distance = getDistanceFromLatLonInKm(
    this.place.latitude,
    this.place.longitude,
    place.latitude,
    place.longitude,
  );
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d);
}

function degreesToRadians(degrees: number): number {
  const pi = Math.PI;
  return degrees * (pi / 180);
}
