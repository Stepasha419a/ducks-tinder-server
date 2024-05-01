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
    'name',
    'nickname',
    'password',
    'preferAgeFrom',
    'preferAgeTo',
    'preferSex',
    'sex',
    'usersOnlyInDistance',
    'alcoholAttitude',
    'attentionSign',
    'childrenAttitude',
    'chronotype',
    'communicationStyle',
    'education',
    'foodPreference',
    'personalityType',
    'pet',
    'smokingAttitude',
    'socialNetworksActivity',
    'trainingAttitude',
    'zodiacSign',
  ] as const;
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
}
