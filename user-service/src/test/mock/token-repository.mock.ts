export const TokenRepositoryMock = jest.fn().mockReturnValue({
  saveRefreshToken: jest.fn(),
  findOneRefreshToken: jest.fn(),
  findOneRefreshTokenByValue: jest.fn(),
  deleteRefreshToken: jest.fn(),
});
