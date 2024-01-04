import { RefreshTokenValueObjectStub } from './refresh-token-value-object.stub';
import { AccessTokenValueObjectStub } from './access-token-value-object.stub';
import { UserStub } from './user-stub';

export const AuthUserAggregateStub = () => ({
  user: UserStub(),
  refreshToken: RefreshTokenValueObjectStub(),
  accessToken: AccessTokenValueObjectStub(),

  getWithoutPrivateFields: jest.fn(),
  autoCommit: false,
  publish: jest.fn(),
  publishAll: jest.fn(),
  commit: jest.fn(),
  uncommit: jest.fn(),
  getUncommittedEvents: jest.fn(),
  loadFromHistory: jest.fn(),
  apply: jest.fn(),
  getEventHandler: jest.fn(),
  getEventName: jest.fn(),
});
