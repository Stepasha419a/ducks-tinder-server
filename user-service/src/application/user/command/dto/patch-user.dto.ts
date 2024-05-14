import { IsDetailedEnum } from '@app/common/shared/decorator';
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
  SmokingAttitude,
  SocialNetworksActivity,
  TrainingAttitude,
  ZodiacSign,
} from 'user-service/src/domain/user';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class PatchUserDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsOptional()
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
  @IsNumber()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @Matches(/^(male|female)$/g, {
    message: 'Sex value must be male or female',
  })
  sex?: string;

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
  preferSex?: string;

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
  @IsArray()
  @IsDetailedEnum(Interest, { each: true })
  @ArrayMaxSize(16)
  interests: Interest[];

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
}
