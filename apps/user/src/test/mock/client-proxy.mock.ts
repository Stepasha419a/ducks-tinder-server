export const ClientProxyMock = jest.fn().mockReturnValue({
  send: jest.fn(),
  emit: jest.fn(),
});
