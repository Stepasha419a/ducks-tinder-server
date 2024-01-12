export const UserServiceMock = jest.fn().mockReturnValue({
  getUser: jest.fn(),
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
});
