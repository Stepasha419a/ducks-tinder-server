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
} from 'apps/user/src/domain/user';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
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
  @IsEnum(Interest, { each: true })
  @ArrayMaxSize(16)
  interests: Interest[];

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
}
