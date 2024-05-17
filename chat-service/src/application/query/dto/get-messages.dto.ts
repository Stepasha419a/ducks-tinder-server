import { IsUUID } from 'class-validator';
import { PaginationDto } from 'src/domain/repository/dto';

export class GetMessagesDto extends PaginationDto {
  @IsUUID()
  chatId: string;
}
