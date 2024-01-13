import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'user/domain';
import { Picture } from 'user/domain/picture';
import { PlaceValueObject } from 'user/domain/value-object';

export class NotValidatedUserDto
  implements
    Omit<User, 'password' | 'activationLink' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @Length(2, 14)
  name: string;

  @IsOptional()
  @IsString()
  @Length(50, 400)
  description: string | null;

  @IsOptional()
  @IsString()
  @Length(6, 16)
  nickname: string | null;

  @IsBoolean()
  isActivated: boolean;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  age: number | null;

  @IsOptional()
  @Matches(/^(male|female)$/g, {
    message: 'Sex value must be male or female',
  })
  sex: string | null;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(100)
  distance: number | null;

  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => PlaceValueObject)
  place: PlaceValueObject | null;

  @IsBoolean()
  usersOnlyInDistance: boolean;

  @IsOptional()
  @Matches(/^(male|female)$/g, {
    message: 'Prefer sex value must be male or female',
  })
  preferSex: 'male' | 'female' | null;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  preferAgeFrom: number | null;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(100)
  preferAgeTo: number | null;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  interests: string[];

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
  communicationStyle: string;

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

  @IsArray()
  @ArrayMaxSize(9)
  pictures: Picture[];
}
