import { Test } from '@nestjs/testing';
import { ShortUser } from 'user-service/src/users.interface';
import { PrismaModule } from '@app/common/database/database.module';
import { PrismaService } from '@app/common/database/database.service';
import { UsersPrismaMock } from 'user-service/src/test/mocks';
import { shortUserStub } from 'user-service/src/test/stubs';
import { GetSortedQueryHandler } from './get-match.query-handler';
import { GetSortedQuery } from './get-match.query';
import { GET_SORTED_FIND_FIRST_CALLED } from 'user-service/src/test/values/users.const.expect';
import { shortUserWithLocationStub } from 'user-service/src/test/stubs';
import { USER_SORTS_DATA } from 'user-service/src/test/values/users.const.dto';

describe('when get sorted is called', () => {
  let prismaService: PrismaService;
  let getSortedQueryHandler: GetSortedQueryHandler;

  const RequestMock = jest.fn().mockReturnValue({
    user: USER_SORTS_DATA,
  });

  let user: ShortUser;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GetSortedQueryHandler],
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(UsersPrismaMock())
      .compile();

    getSortedQueryHandler = moduleRef.get<GetSortedQueryHandler>(
      GetSortedQueryHandler,
    );
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    prismaService.user.findUnique = jest.fn().mockResolvedValue(() => ({
      checked: [],
    }));
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      prismaService.user.findFirst = jest
        .fn()
        .mockResolvedValue(shortUserWithLocationStub());
      prismaService.checkedUsers.findMany = jest.fn().mockResolvedValue([]);
    });

    beforeEach(async () => {
      jest.clearAllMocks();
      user = await getSortedQueryHandler.execute(
        new GetSortedQuery(RequestMock().user),
      );
    });

    it('should call checked users find many', () => {
      expect(prismaService.checkedUsers.findMany).toBeCalledTimes(1);
      expect(prismaService.checkedUsers.findMany).toBeCalledWith({
        where: {
          OR: [
            { checkedId: shortUserStub().id },
            { wasCheckedId: shortUserStub().id },
          ],
        },
        select: {
          checked: { select: { id: true } },
          wasChecked: { select: { id: true } },
        },
      });
    });

    it('should call find first', () => {
      expect(prismaService.user.findFirst).toBeCalledTimes(1);
      expect(prismaService.user.findFirst).toBeCalledWith(
        GET_SORTED_FIND_FIRST_CALLED,
      );
    });

    it('should return a short user', () => {
      expect(user).toEqual(shortUserStub());
    });
  });
});
