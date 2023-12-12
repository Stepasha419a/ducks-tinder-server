import { ShortUserPlaceInfo, UserPlaceInfo } from './place/place.interface';

export interface PictureInterface {
  name: string;
  order: number;
}

export type Sex = 'male' | 'female';

export interface User {
  id: string;
  password: string;
  email: string;
  name: string;
  description?: string;
  nickname?: string;
  isActivated: boolean;
  activationLink: string;
  age?: number;
  sex?: string;
  distance?: number;
  usersOnlyInDistance?: boolean;
  preferSex?: string;
  preferAgeFrom?: number;
  preferAgeTo?: number;

  interests?: string[];
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

  place: UserPlaceInfo;

  pictures: PictureInterface[];

  createdAt: string;
  updatedAt: string;
}

export type ResponseUser = Omit<
  User,
  'password' | 'activationLink' | 'createdAt' | 'updatedAt'
>;

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

  pictures: PictureInterface[];

  place: ShortUserPlaceInfo;
}

export interface ShortUserWithDistance extends ShortUser {
  distance: number;
}
