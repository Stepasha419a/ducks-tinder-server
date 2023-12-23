import { NameObjectDto } from './legacy/dto';

export interface PictureInterface {
  name: string;
  order: number;
}

interface PlaceName {
  name: string;
}

export interface ShortUserWithoutDistance {
  id: string;
  name: string;
  age: number;
  description: string;
  isActivated: boolean;
  interests: NameObjectDto[];
  place: PlaceName;
  pictures: PictureInterface[];
}

export interface ShortUser extends ShortUserWithoutDistance {
  distance: number;
}
