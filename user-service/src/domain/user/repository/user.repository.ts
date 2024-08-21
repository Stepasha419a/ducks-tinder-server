import { UserAggregate } from 'src/domain/user';
import { MatchFilterDto, PairsFilterDto } from './dto';
import { PictureEntity, PlaceEntity, UserCheckEntity } from '../entity';

export abstract class UserRepository {
  abstract save(user: UserAggregate): Promise<UserAggregate>;
  abstract saveLastReturnable(
    id: string,
    returnableUser: UserAggregate,
  ): Promise<UserAggregate>;
  abstract savePair(id: string, forId: string): Promise<UserAggregate>;
  abstract saveUserCheck(userCheck: UserCheckEntity): Promise<UserCheckEntity>;
  abstract findOne(id: string): Promise<UserAggregate | null>;
  abstract findMany(ids: string[]): Promise<UserAggregate[]>;
  abstract findPair(id: string, forId: string): Promise<UserAggregate | null>;
  abstract findPairs(id: string, dto: PairsFilterDto): Promise<UserAggregate[]>;
  abstract findPairsCount(id: string): Promise<number>;
  abstract findFirstPairsPicture(id: string): Promise<PictureEntity>;
  abstract findUserChecksWithUser(
    id: string,
    checkId: string,
  ): Promise<UserCheckEntity[]>;
  abstract findLastReturnableUser(id: string): Promise<UserAggregate | null>;
  abstract findMatch(
    user: UserAggregate,
    dto: MatchFilterDto,
  ): Promise<UserAggregate[]>;
  abstract findPlace(userId: string): Promise<PlaceEntity | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract deletePair(id: string, forId: string): Promise<boolean>;
  abstract deleteLastReturnable(id: string): Promise<boolean>;
  abstract deleteUserCheck(
    checkedId: string,
    wasCheckedId: string,
  ): Promise<boolean>;
}
