export const UserServiceMock = jest.fn().mockReturnValue({
  getUser: jest.fn(),
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  validateAccessToken: jest.fn(),
  validateRefreshToken: jest.fn(),
});
