export const RefreshTokenValueObjectStub = () => ({
  id: 'asdasdsad1231231',
  value:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoidGVzdCJ9.9EQaLsDRKDVXLUVLR9JgDTjEULaT2-OMbHayQAzgZH8',
  createdAt: new Date('02-02-2002').toISOString(),
  updatedAt: new Date('02-02-2002').toISOString(),

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
