import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from './get-user-by-email.query';
import { UserRepository } from 'users/providers';
import { UserAggregate } from 'users/domain';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: GetUserByEmailQuery): Promise<UserAggregate | null> {
    const { email } = command;

    const userAggregate = await this.repository.findOneByEmail(email);

    /* const pairsCount = await this.prismaService.user.count({
      where: { pairFor: { some: { email } } },
    });
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: UsersSelector.selectUser(),
    }); */

    return userAggregate;
  }
}
