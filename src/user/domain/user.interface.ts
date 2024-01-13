import { UserPictureInfo } from 'user/infrastructure/mapper';
import { PictureValueObject, PlaceValueObject } from './value-object';

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

  place: PlaceValueObject;

  pictures: PictureValueObject[];

  createdAt: string;
  updatedAt: string;
}

export interface ResponseUser
  extends Omit<
    User,
    'activationLink' | 'password' | 'createdAt' | 'updatedAt' | 'pictures'
  > {
  pictures: UserPictureInfo[];
}

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

  place: PlaceValueObject;
}

export interface ShortUserWithDistance extends ShortUser {
  distance: number;
}
