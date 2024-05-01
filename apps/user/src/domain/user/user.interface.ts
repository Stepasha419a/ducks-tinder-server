import { PictureEntity, PlaceEntity } from './entity';

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

  place: PlaceEntity;

  pictures: PictureEntity[];

  createdAt: string;
  updatedAt: string;
}

export enum AlcoholAttitude {
  'Not for me',
  'Sober',
  'Sober curious',
  'On special occasions',
  'Socially on weekends',
  'Most Nights',
}

export enum AttentionSign {
  'Attention gestures',
  'Gifts',
  'Touches',
  'Compliments',
  'Time together',
}

export enum ChildrenAttitude {
  'I want children',
  'I do not want children',
  'I have children and I want more',
  'I have children, but I do not want any more',
  'Do not know yet',
}

export enum Chronotype {
  'Early bird',
  'Night owl',
  'In a spectrum',
}

export enum CommunicationStyle {
  'Messaging a lot',
  'Phone communication',
  'Video chats',
  'Do not like messaging',
  'Meet in person',
}

export enum Education {
  'Bachelor',
  'College',
  'Middle school',
  'Doctor of sciences',
  'Postgraduate',
  'Magistracy',
  'Technical school',
}

export enum FoodPreference {
  'Vegan',
  'Vegetarian',
  'Pescatarian',
  'Kosher',
  'Halal',
  'Carnivore',
  'Omnivore',
  'Other',
}

export enum PersonalityType {
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'Entertainer',
}

export enum Pet {
  'Dog',
  'Cat',
  'Reptile',
  'Amphibian',
  'Bird',
  'Fish',
  'Other',
  'Turtle',
  'Hamster',
  'Rabbit',
  'Pet-free',
  'All the pets',
  'Want a pet',
  'Allergic to pets',
}

export enum SmokingAttitude {
  'Social smoker',
  'Smoker when drinking',
  'Non-smoker',
  'Smoker',
  'Trying to quit',
}

export enum SocialNetworksActivity {
  'Influencer status',
  'Socially active',
  'Off the grid',
  'Passive scroller',
}

export enum TrainingAttitude {
  'Everyday',
  'Often',
  'Sometimes',
  'Gym rat',
  'Occasionally',
  'Never',
}

export enum ZodiacSign {
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpius',
  'Sagittarius',
  'Capricornus',
  'Aquarius',
  'Pisces',
}
