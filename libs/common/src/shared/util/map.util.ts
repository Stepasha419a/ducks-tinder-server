interface SearchingCoords {
  maxLatitude: number;
  minLatitude: number;
  maxLongitude: number;
  minLongitude: number;
}

export class MapUtil {
  public static getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d);
  }

  public static getSearchingCoords(
    latitude: number,
    longitude: number,
    distance: number,
  ): SearchingCoords {
    const maxLatitude = latitude + this.km * distance * 0.7;
    const minLatitude = latitude - this.km * distance * 0.7;
    const maxLongitude = longitude + this.km * distance * 0.7;
    const minLongitude = longitude - this.km * distance * 0.7;

    return { maxLatitude, minLatitude, maxLongitude, minLongitude };
  }

  private static degreesToRadians(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
  }

  // 1 lat deg = km
  private static readonly km = 0.009009;
}
