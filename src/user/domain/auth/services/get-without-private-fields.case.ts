import { PictureAggregate } from 'user/domain/picture';
import { AuthUser } from '../auth-user.interface';

export interface GetWithoutPrivateFields {
  getWithoutPrivateFields(this: AuthUser): Promise<Partial<AuthUser>>;
}

export async function GET_WITHOUT_PRIVATE_FIELDS(
  this: AuthUser,
): Promise<Partial<AuthUser>> {
  const pictures = await Promise.all(
    this.user.pictures.map((picture) =>
      PictureAggregate.create(picture).getUserPictureInfo(),
    ),
  );

  return { user: { ...this.user, pictures }, accessToken: this.accessToken };
}
