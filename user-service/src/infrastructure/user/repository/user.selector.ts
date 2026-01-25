import { UserSelect } from 'src/infrastructure/database/prisma/models';

export class UserSelector {
  static selectUser(): UserSelect {
    return {
      interests: { select: { interest: true } },
      pictures: {
        orderBy: { order: 'asc' as 'asc' | 'desc' },
      },
      place: {
        select: { name: true, address: true, latitude: true, longitude: true },
      },
    };
  }
}
