import { User, UserAggregate } from 'users/domain';

export abstract class UserRepository {
  abstract save(user: User): Promise<UserAggregate>;
  abstract findOne(id: string): Promise<UserAggregate | null>;
  abstract findOneByEmail(email: string): Promise<UserAggregate | null>;
  abstract findPairs(id: string): Promise<UserAggregate[]>;
  abstract findCheckedUserIds(id: string, checkId: string): Promise<string[]>;
  abstract findSorted(
    id: string,
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number,
    preferAgeFrom: number,
    preferAgeTo: number,
    age: number,
    preferSex: 'male' | 'female',
    sex: 'male' | 'female',
  ): Promise<UserAggregate | null>;
  abstract createPair(id: string, forId: string): Promise<UserAggregate | null>;
  abstract makeChecked(id: string, forId: string): Promise<boolean>;
  abstract delete(id: string): Promise<boolean>;
}
