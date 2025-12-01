import { IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsUUID('4', { each: true })
  memberIds: string[];
}
