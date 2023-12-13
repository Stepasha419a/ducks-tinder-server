import { User, UserAggregate } from 'users/domain';

export abstract class UserRepository {
  abstract save(user: User): Promise<UserAggregate>;
  abstract findOne(id: string): Promise<UserAggregate | null>;
  abstract findOneByEmail(email: string): Promise<UserAggregate | null>;
  abstract findPairs(id: string): Promise<UserAggregate[]>;
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
  abstract delete(id: string): Promise<boolean>;
}
