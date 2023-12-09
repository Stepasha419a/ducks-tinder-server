import { User, UserAggregate } from 'users/domain';

export abstract class UserRepository {
  abstract save(user: User): Promise<UserAggregate>;
  abstract findOne(id: string): Promise<UserAggregate | null>;
  abstract findOneByEmail(email: string): Promise<UserAggregate | null>;
  abstract delete(id: string): Promise<boolean>;
}
