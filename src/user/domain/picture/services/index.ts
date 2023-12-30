import { AggregateRoot } from '@nestjs/cqrs';
import {
  GET_USER_PICTURE_INFO,
  GetUserPictureInfo,
} from './get-user-picture-info.case';
import { IsDefined } from 'class-validator';
import { GET_PICTURE, GetPicture } from './get-picture.case';
import { DECREASE_ORDER, DecreaseOrder } from './decrease-order.case';

export class PictureServices
  extends AggregateRoot
  implements GetUserPictureInfo, GetPicture, DecreaseOrder
{
  @IsDefined()
  getUserPictureInfo = GET_USER_PICTURE_INFO;

  @IsDefined()
  getPicture = GET_PICTURE;

  @IsDefined()
  decreaseOrder = DECREASE_ORDER;
}
