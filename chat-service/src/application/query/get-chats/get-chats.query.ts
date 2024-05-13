import { PaginationDto } from '@app/common/shared/dto';

export class GetChatsQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: PaginationDto,
  ) {}
}
