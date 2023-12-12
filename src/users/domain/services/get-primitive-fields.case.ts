import { UserPlaceInfo } from '../place';
import { User } from '../user.interface';

export interface GetPrimitiveFields {
  getPrimitiveFields(): Promise<UserPrimitiveFields>;
}

export async function GET_PRIMITIVE_FIELDS(
  this: User,
): Promise<UserPrimitiveFields> {
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
