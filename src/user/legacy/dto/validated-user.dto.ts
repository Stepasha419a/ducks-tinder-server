import { Type } from 'class-transformer';
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
import { User } from 'user/domain';
import { PictureValueObject, PlaceValueObject } from 'user/domain/value-object';

export class ValidatedUserDto
  implements
    Omit<User, 'password' | 'activationLink' | 'createdAt' | 'updatedAt'>
{
  @IsString() // because e2e tests use string ids (not uuid)
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
  description: string;

  @IsOptional()
  @IsString()
  @Length(6, 16)
  nickname: string;

  @IsBoolean()
  isActivated: boolean;

  @IsNumber()
  @Min(18)
  @Max(100)
  age: number;

  @Matches(/^(male|female)$/g, {
    message: 'Sex value must be male or female',
  })
  sex: string;

  @IsNumber()
  @Min(2)
  @Max(100)
  distance: number;

  @IsBoolean()
  usersOnlyInDistance: boolean;

  @Matches(/^(male|female)$/g, {
    message: 'Prefer sex value must be male or female',
  })
  preferSex: 'male' | 'female';

  @IsNumber()
  @Min(18)
  @Max(100)
  preferAgeFrom: number;

  @IsNumber()
  @Min(20)
  @Max(100)
  preferAgeTo: number;

  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => PlaceValueObject)
  place: PlaceValueObject;

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
  pictures: PictureValueObject[];
}
