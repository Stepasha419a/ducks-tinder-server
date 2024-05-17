import { PaginationDto } from 'src/domain/repository/dto';

export class GetChatsQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: PaginationDto,
  ) {}
}
