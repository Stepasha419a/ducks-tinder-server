export const RefreshTokenRepositoryMock = jest.fn().mockReturnValue({
  save: jest.fn(),
  findOne: jest.fn(),
  findOneByValue: jest.fn(),
  delete: jest.fn(),
});
