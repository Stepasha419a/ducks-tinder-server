import { UserSelector } from 'apps/user/src/infrastructure/user/repository/user.selector';
import prismaClient from '@app/common/database/test/database-client';

export async function prepareBefore(currentUserId, secondUserId) {
  await prismaClient.$transaction([
    prismaClient.user.createMany({
      data: [
        {
          id: currentUserId,
          email: `${currentUserId}@gmail.com`,
          password: '123123',
          name: 'Jason',
          age: 20,
          distance: 50,
          preferAgeFrom: 18,
          preferAgeTo: 26,
          isActivated: false,
          sex: 'male',
          preferSex: 'female',
          usersOnlyInDistance: false,
        },
        {
          id: secondUserId,
          email: `${secondUserId}@gmail.com`,
          password: '456456',
          name: 'Loren',
          age: 21,
          distance: 70,
          preferAgeFrom: 18,
          preferAgeTo: 28,
          isActivated: false,
          sex: 'female',
          preferSex: 'male',
          usersOnlyInDistance: false,
        },
      ],
    }),
    prismaClient.place.createMany({
      data: [
        {
          id: currentUserId,
          latitude: 12.3456789,
          longitude: 12.3456789,
          name: 'current-user-place-name',
          address: 'current-user-place-address',
        },
        {
          id: secondUserId,
          latitude: 12.5456789,
          longitude: 12.5456789,
          name: 'second-user-place-name',
          address: 'second-user-place-address',
        },
      ],
    }),
  ]);

  const currentUser = await prismaClient.user.findUnique({
    where: { id: currentUserId },
    include: UserSelector.selectUser(),
  });
  const secondUser = await prismaClient.user.findUnique({
    where: { id: secondUserId },
    include: UserSelector.selectUser(),
  });

  /* const currentUser = new UserDto(
    await prismaClient.user.findUnique({
      where: { id: currentUserId },
      include: UsersSelector.selectUser(),
    }),
  );
  const secondUser = new UserDto(
    await prismaClient.user.findUnique({
      where: { id: secondUserId },
      include: UsersSelector.selectUser(),
    }),
  ); */
  return { currentUser, secondUser };
}
