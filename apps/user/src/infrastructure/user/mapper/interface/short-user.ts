import { UserPictureInfo } from './user-picture-info';
import { ShortUserPlaceInfo } from './short-user-place-info';
import {
  AlcoholAttitude,
  AttentionSign,
  ChildrenAttitude,
  Chronotype,
  CommunicationStyle,
  Education,
  FoodPreference,
  PersonalityType,
  Pet,
  SmokingAttitude,
  SocialNetworksActivity,
  TrainingAttitude,
  ZodiacSign,
} from 'apps/user/src/domain/user';

export interface ShortUser {
  id: string;
  name: string;
  age: number;
  description: string;
  isActivated: boolean;

  interests: string[];
  zodiacSign?: ZodiacSign;
  education?: Education;
  alcoholAttitude?: AlcoholAttitude;
  chronotype?: Chronotype;
  foodPreference?: FoodPreference;
  pet?: Pet;
  smokingAttitude?: SmokingAttitude;
  socialNetworksActivity?: SocialNetworksActivity;
  trainingAttitude?: TrainingAttitude;
  childrenAttitude?: ChildrenAttitude;
  personalityType?: PersonalityType;
  communicationStyle?: CommunicationStyle;
  attentionSign?: AttentionSign;

  pictures: UserPictureInfo[];

  place: ShortUserPlaceInfo;
}
