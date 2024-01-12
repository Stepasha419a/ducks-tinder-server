import { UserStub } from './user-stub';

export const UserAggregateStub = () => ({
  ...UserStub(),

  setDescription: jest.fn(),
  comparePasswords: jest.fn(),
  setPlace: jest.fn(),
  setDistance: jest.fn(),
  getPrimitiveFields: jest.fn(),
  getResponseUser: jest.fn(),
  getShortUserWithDistance: jest.fn(),
  addPicture: jest.fn(),
  deletePicture: jest.fn(),
  sortPictureOrders: jest.fn(),
  mixPictureOrders: jest.fn(),
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
