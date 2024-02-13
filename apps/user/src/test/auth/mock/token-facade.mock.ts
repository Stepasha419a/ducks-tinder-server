export const TokenFacadeMock = jest.fn().mockReturnValue({
  commands: { generateTokens: jest.fn(), removeToken: jest.fn() },
  queries: { validateRefreshToken: jest.fn(), validateAccessToken: jest.fn() },
});
