import { Sex, User } from './user.interface';
import { UserServices } from './services';
import {
  IsArray,
  IsBoolean,
  IsEmail,
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
import { PictureValueObject, PlaceValueObject } from './value-object';
import { randomUUID } from 'crypto';

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
  @Type(() => PlaceValueObject)
  place: PlaceValueObject;

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

  @IsOptional()
  @IsArray()
  @Type(() => String)
  interests: string[];

  @IsOptional()
  @IsArray()
  @Type(() => PictureValueObject)
  pictures: PictureValueObject[];

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
