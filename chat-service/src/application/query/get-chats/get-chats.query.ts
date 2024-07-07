import { PaginationDto } from 'src/domain/chat/repository/dto';

export class GetChatsQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: PaginationDto,
  ) {}
}
