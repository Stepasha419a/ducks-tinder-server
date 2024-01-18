import { IsUUID } from 'class-validator';
import { PaginationDto } from '@app/common/dto';

export class GetMessagesDto extends PaginationDto {
  @IsUUID()
  chatId: string;
}
