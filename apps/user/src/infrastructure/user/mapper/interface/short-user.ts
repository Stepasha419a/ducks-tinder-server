import { UserPictureInfo } from './user-picture-info';
import { ShortUserPlaceInfo } from './short-user-place-info';

export interface ShortUser {
  id: string;
  name: string;
  age: number;
  description: string;
  isActivated: boolean;

  interests: string[];
  zodiacSign?: string;
  education?: string;
  alcoholAttitude?: string;
  chronotype?: string;
  foodPreference?: string;
  pet?: string;
  smokingAttitude?: string;
  socialNetworksActivity?: string;
  trainingAttitude?: string;
  childrenAttitude?: string;
  personalityType?: string;
  communicationStyle?: string;
  attentionSign?: string;

  pictures: UserPictureInfo[];

  place: ShortUserPlaceInfo;
}
