import { Prisma } from '@prisma/client';

export class UserSelector {
  static selectUser(): Prisma.UserSelect {
    return {
      interests: { select: { interest: { select: { name: true } } } },
      pictures: {
        orderBy: { order: 'asc' as 'asc' | 'desc' },
      },
      place: {
        select: { name: true, address: true, latitude: true, longitude: true },
      },
    };
  }
}
