export const TokenAdapterMock = jest.fn().mockReturnValue({
  generateTokens: jest.fn(),
  removeToken: jest.fn(),
  validateRefreshToken: jest.fn(),
  validateAccessToken: jest.fn(),
});
