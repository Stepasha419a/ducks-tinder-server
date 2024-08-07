import {
  AlcoholAttitude,
  AttentionSign,
  ChildrenAttitude,
  Chronotype,
  CommunicationStyle,
  Education,
  FoodPreference,
  Interest,
  PersonalityType,
  Pet,
  Sex,
  SmokingAttitude,
  SocialNetworksActivity,
  TrainingAttitude,
  User,
  ZodiacSign,
} from './user.interface';
import { UserServices } from './services';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { Type } from 'class-transformer';
import { randomUUID } from 'crypto';
import { PictureEntity, PlaceEntity } from './entity';
import { DomainError, IsDetailedEnum } from '../common';

export class UserAggregate extends UserServices implements User {
  @IsUUID()
  id: string = randomUUID();

  @IsString()
  @Length(2, 14)
  name: string;

  @IsOptional()
  @IsString()
  @Length(50, 400)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(6, 16)
  nickname?: string;

  @IsOptional()
  @IsBoolean()
  isActivated = false;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @Matches(/^(male|female)$/g, {
    message: 'Sex value must be male or female',
  })
  sex?: Sex;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(100)
  distance?: number;

  @IsOptional()
  @IsBoolean()
  usersOnlyInDistance?: boolean;

  @IsOptional()
  @Matches(/^(male|female)$/g, {
    message: 'Prefer sex value must be male or female',
  })
  preferSex?: Sex;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  preferAgeFrom?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(100)
  preferAgeTo?: number;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => PlaceEntity)
  place?: PlaceEntity;

  @IsOptional()
  @IsDetailedEnum(ZodiacSign)
  zodiacSign?: ZodiacSign;

  @IsOptional()
  @IsDetailedEnum(Education)
  education?: Education;

  @IsOptional()
  @IsDetailedEnum(ChildrenAttitude)
  childrenAttitude?: ChildrenAttitude;

  @IsOptional()
  @IsDetailedEnum(PersonalityType)
  personalityType?: PersonalityType;

  @IsOptional()
  @IsDetailedEnum(CommunicationStyle)
  communicationStyle?: CommunicationStyle;

  @IsOptional()
  @IsDetailedEnum(AttentionSign)
  attentionSign?: AttentionSign;

  @IsOptional()
  @IsDetailedEnum(AlcoholAttitude)
  alcoholAttitude?: AlcoholAttitude;

  @IsOptional()
  @IsDetailedEnum(Chronotype)
  chronotype?: Chronotype;

  @IsOptional()
  @IsDetailedEnum(FoodPreference)
  foodPreference?: FoodPreference;

  @IsOptional()
  @IsDetailedEnum(Pet)
  pet?: Pet;

  @IsOptional()
  @IsDetailedEnum(SmokingAttitude)
  smokingAttitude?: SmokingAttitude;

  @IsOptional()
  @IsDetailedEnum(SocialNetworksActivity)
  socialNetworksActivity?: SocialNetworksActivity;

  @IsOptional()
  @IsDetailedEnum(TrainingAttitude)
  trainingAttitude?: TrainingAttitude;

  @IsOptional()
  @IsArray()
  @IsDetailedEnum(Interest, { each: true })
  interests: Interest[];

  @IsOptional()
  @IsArray()
  @Type(() => PictureEntity)
  pictures: PictureEntity[];

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  updatedAt = new Date().toISOString();

  private constructor() {
    super();
  }

  static create(user: Partial<User>) {
    const _user = new UserAggregate();

    Object.assign(_user, user);

    const errors = validateSync(_user, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'User is invalid');
    }

    return _user;
  }
}
