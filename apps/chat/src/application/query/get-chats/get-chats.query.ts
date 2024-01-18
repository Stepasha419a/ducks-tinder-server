import { PaginationDto } from '@app/common/dto';

export class GetChatsQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: PaginationDto,
  ) {}
}
