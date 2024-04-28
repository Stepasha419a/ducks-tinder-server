import { UserAggregate } from 'apps/user/src/domain/user';
import { PairsFilterDto } from './dto';
import { PictureEntity, PlaceEntity, UserCheckEntity } from '../entity';

export abstract class UserRepository {
  abstract save(user: UserAggregate): Promise<UserAggregate>;
  abstract findOne(id: string): Promise<UserAggregate | null>;
  abstract findOneByEmail(email: string): Promise<UserAggregate | null>;
  abstract findMany(ids: string[]): Promise<UserAggregate[]>;
  abstract findPair(id: string, forId: string): Promise<UserAggregate | null>;
  abstract findPairs(id: string, dto: PairsFilterDto): Promise<UserAggregate[]>;
  abstract findPairsCount(id: string): Promise<number>;
  abstract findFirstPairsPicture(id: string): Promise<PictureEntity>;
  abstract findCheckedUserIds(id: string, checkId: string): Promise<string[]>;
  abstract findUserNotPairCheck(
    checkedByUserId: string,
  ): Promise<UserCheckEntity>;
  abstract findSorted(
    id: string,
    latitude: number,
    longitude: number,
    distance: number,
    preferAgeFrom: number,
    preferAgeTo: number,
    age: number,
    preferSex: 'male' | 'female',
    sex: 'male' | 'female',
  ): Promise<UserAggregate | null>;
  abstract findPlace(userId: string): Promise<PlaceEntity | null>;
  abstract createPair(id: string, forId: string): Promise<UserAggregate | null>;
  abstract makeChecked(id: string, forId: string): Promise<boolean>;
  abstract delete(id: string): Promise<boolean>;
  abstract deletePair(id: string, forId: string): Promise<boolean>;
  abstract deleteUserCheck(
    checkedId: string,
    wasCheckedId: string,
  ): Promise<boolean>;
}
