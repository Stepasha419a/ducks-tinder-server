import { AggregateRoot } from '@nestjs/cqrs';
import {
  GET_USER_PICTURE_INFO,
  GetUserPictureInfo,
} from './get-user-picture-info.case';
import { IsDefined } from 'class-validator';

export class PictureServices
  extends AggregateRoot
  implements GetUserPictureInfo
{
  @IsDefined()
  getUserPictureInfo = GET_USER_PICTURE_INFO;
}
