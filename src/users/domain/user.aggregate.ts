import * as bcrypt from 'bcryptjs';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import {
  PictureInterface,
  ResponseUser,
  Sex,
  ShortUserWithDistance,
  User,
} from './user.interface';
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
import { DomainError } from 'users/errors';
import { Type } from 'class-transformer';
import { PlaceAggregate } from './place.aggregate';
import { UserPlaceInfo } from './place.interface';

export class PictureAggregate implements PictureInterface {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(8)
  order: number;
}

export class UserAggregate extends UserServices implements User {
  @IsUUID()
  id: string = randomStringGenerator();

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
  activationLink: string = randomStringGenerator();

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
  @Type(() => PlaceAggregate)
  place: UserPlaceInfo;

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
  @Type(() => PictureAggregate)
  pictures: PictureAggregate[];

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

    _user.updatedAt = _user?.id ? new Date().toISOString() : _user.updatedAt;
    const errors = validateSync(_user, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'User is invalid');
    }

    return _user;
  }

  async comparePasswords(passwordToCompare: string): Promise<boolean> {
    return bcrypt.compare(passwordToCompare, this.password);
  }

  setPlace(placeAggregate: PlaceAggregate) {
    this.place = placeAggregate.getUserPlaceInfo();
  }

  setDistance(distance: number) {
    this.distance = distance;
  }

  getPrimitiveFields(): UserPrimitiveFields {
    const keys: Array<keyof User> = [
      'age',
      'description',
      'distance',
      'email',
      'interests',
      'name',
      'nickname',
      'password',
      'place',
      'preferAgeFrom',
      'preferAgeTo',
      'preferSex',
      'sex',
      'usersOnlyInDistance',
    ];
    const subset = Object.fromEntries(
      keys.map((key) => [key, this[key]]),
    ) as UserPrimitiveFields;

    return subset;
  }

  getResponseUser(): ResponseUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      age: this.age,
      description: this.description,
      distance: this.distance,
      isActivated: this.isActivated,

      interests: this.interests,
      zodiacSign: this.zodiacSign,
      education: this.education,
      alcoholAttitude: this.alcoholAttitude,
      chronotype: this.chronotype,
      foodPreference: this.foodPreference,
      pet: this.pet,
      smokingAttitude: this.smokingAttitude,
      socialNetworksActivity: this.socialNetworksActivity,
      trainingAttitude: this.trainingAttitude,
      childrenAttitude: this.childrenAttitude,
      personalityType: this.personalityType,
      communicationStyle: this.communicationStyle,
      attentionSign: this.attentionSign,

      place: this.place,

      pictures: this.pictures,
    };
  }

  getShortUserWithDistance(): ShortUserWithDistance {
    const placeAggregate = PlaceAggregate.create({
      ...this.place,
      id: this.id,
    });

    return {
      id: this.id,
      name: this.name,
      age: this.age,
      description: this.description,
      distance: this.distance,
      isActivated: this.isActivated,

      interests: this.interests,
      zodiacSign: this.zodiacSign,
      education: this.education,
      alcoholAttitude: this.alcoholAttitude,
      chronotype: this.chronotype,
      foodPreference: this.foodPreference,
      pet: this.pet,
      smokingAttitude: this.smokingAttitude,
      socialNetworksActivity: this.socialNetworksActivity,
      trainingAttitude: this.trainingAttitude,
      childrenAttitude: this.childrenAttitude,
      personalityType: this.personalityType,
      communicationStyle: this.communicationStyle,
      attentionSign: this.attentionSign,

      place: placeAggregate.getShortUserPlaceInfo(),

      pictures: this.pictures,
    };
  }
}

export interface UserPrimitiveFields {
  password?: string;
  email?: string;
  name?: string;
  description?: string;
  nickname?: string;
  age?: number;
  sex?: string;
  distance?: number;
  usersOnlyInDistance?: boolean;
  preferSex?: string;
  preferAgeFrom?: number;
  preferAgeTo?: number;

  interests?: string[];

  place?: UserPlaceInfo;
}
