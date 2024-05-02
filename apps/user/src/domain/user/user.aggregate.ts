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
  IsEmail,
  IsEnum,
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
  MaxLength,
  Min,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { Type } from 'class-transformer';
import { randomUUID } from 'crypto';
import { PictureEntity, PlaceEntity } from './entity';

export class UserAggregate extends UserServices implements User {
  @IsUUID()
  id: string = randomUUID();

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

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
  @IsString()
  @IsNotEmpty()
  activationLink: string = randomUUID();

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
  place: PlaceEntity;

  @IsOptional()
  @IsEnum(ZodiacSign)
  zodiacSign?: ZodiacSign;

  @IsOptional()
  @IsEnum(Education)
  education?: Education;

  @IsOptional()
  @IsEnum(ChildrenAttitude)
  childrenAttitude?: ChildrenAttitude;

  @IsOptional()
  @IsEnum(PersonalityType)
  personalityType?: PersonalityType;

  @IsOptional()
  @IsEnum(CommunicationStyle)
  communicationStyle?: CommunicationStyle;

  @IsOptional()
  @IsEnum(AttentionSign)
  attentionSign?: AttentionSign;

  @IsOptional()
  @IsEnum(AlcoholAttitude)
  alcoholAttitude?: AlcoholAttitude;

  @IsOptional()
  @IsEnum(Chronotype)
  chronotype?: Chronotype;

  @IsOptional()
  @IsEnum(FoodPreference)
  foodPreference?: FoodPreference;

  @IsOptional()
  @IsEnum(Pet)
  pet?: Pet;

  @IsOptional()
  @IsEnum(SmokingAttitude)
  smokingAttitude?: SmokingAttitude;

  @IsOptional()
  @IsEnum(SocialNetworksActivity)
  socialNetworksActivity?: SocialNetworksActivity;

  @IsOptional()
  @IsEnum(TrainingAttitude)
  trainingAttitude?: TrainingAttitude;

  @IsOptional()
  @IsArray()
  @IsEnum(Interest, { each: true })
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
