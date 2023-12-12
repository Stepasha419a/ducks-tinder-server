import { AuthUser } from '../auth-user.interface';

export interface GetWithoutPrivateFields {
  getWithoutPrivateFields(this: AuthUser): Promise<Partial<AuthUser>>;
}

export async function GET_WITHOUT_PRIVATE_FIELDS(
  this: AuthUser,
): Promise<Partial<AuthUser>> {
  return { user: this.user, accessToken: this.accessToken };
}
