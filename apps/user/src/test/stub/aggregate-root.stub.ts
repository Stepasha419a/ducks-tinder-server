import { AggregateRoot } from '@nestjs/cqrs';

export const AggregateRootStub = () =>
  ({
    publish: jest.fn(),
    publishAll: jest.fn(),
    commit: jest.fn(),
    uncommit: jest.fn(),
    getUncommittedEvents: jest.fn(),
    loadFromHistory: jest.fn(),
    apply: jest.fn(),
    getEventHandler: jest.fn(),
    getEventName: jest.fn(),
    autoCommit: false,
  }) as unknown as AggregateRoot;
