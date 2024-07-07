import { IsUUID } from 'class-validator';
import { PaginationDto } from 'src/domain/chat/repository/dto';

export class GetMessagesDto extends PaginationDto {
  @IsUUID()
  chatId: string;
}
