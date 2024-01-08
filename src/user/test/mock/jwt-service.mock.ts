export const JwtServiceMock = jest.fn().mockReturnValue({
  sign: jest.fn(),
  verify: jest.fn(),
});
