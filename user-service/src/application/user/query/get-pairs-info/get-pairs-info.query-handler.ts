import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPairsInfoQuery } from './get-pairs-info.query';
import { PairsInfoView } from '../../view';
import { UserRepository } from 'user-service/src/domain/user/repository';

@QueryHandler(GetPairsInfoQuery)
export class GetPairsInfoQueryHandler
  implements IQueryHandler<GetPairsInfoQuery, PairsInfoView>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetPairsInfoQuery): Promise<PairsInfoView> {
    const { userId } = query;

    const view: PairsInfoView = {
      count: 0,
      picture: null,
    };

    const count = await this.repository.findPairsCount(userId);
    view.count = count;

    if (count > 0) {
      const picture = await this.repository.findFirstPairsPicture(userId);
      view.picture = picture;
    }

    return view;
  }
}
