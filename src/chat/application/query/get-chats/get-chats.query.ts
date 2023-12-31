import { PaginationDto } from 'libs/shared/dto';

export class GetChatsQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: PaginationDto,
  ) {}
}
