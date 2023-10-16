import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { User } from './user.interface';
import { UserServices } from './services';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
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

export class UserAggregate extends UserServices implements User {
  @IsUUID()
  id: string = randomStringGenerator();

  @IsString()
  @Length(6, 30)
  password: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @Length(2, 14)
  name: string;

  @IsString()
  @Length(50, 400)
  description?: string;

  @IsString()
  @Length(6, 16)
  nickname?: string;

  @IsBoolean()
  isActivated = false;

  @IsString()
  @IsNotEmpty()
  activationLink: string;

  @IsNumber()
  @Min(18)
  @Max(100)
  age?: number;

  @Matches(/^(male|female)$/g, {
    message: 'Sex value must be male or female',
  })
  sex?: string;

  @IsNumber()
  @Min(2)
  @Max(100)
  distance?: number;

  @IsBoolean()
  usersOnlyInDistance?: boolean;

  @Matches(/^(male|female)$/g, {
    message: 'Prefer sex value must be male or female',
  })
  preferSex?: string;

  @IsNumber()
  @Min(18)
  @Max(100)
  preferAgeFrom?: number;

  @IsNumber()
  @Min(20)
  @Max(100)
  preferAgeTo?: number;

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
}
