import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
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
  @IsString({ each: true })
  @ArrayMaxSize(16)
  interests?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  zodiacSign?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  education?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  childrenAttitude?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  personalityType?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  communicationStyle?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  attentionSign?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  alcoholAttitude?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  chronotype?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  foodPreference?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pet?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  smokingAttitude?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  socialNetworksActivity?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  trainingAttitude?: string;
}
