import { IsUUID } from 'class-validator';
import { PaginationDto } from 'libs/shared/dto';

export class GetMessagesDto extends PaginationDto {
  @IsUUID()
  chatId: string;
}
