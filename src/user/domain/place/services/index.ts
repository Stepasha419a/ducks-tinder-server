import { AggregateRoot } from '@nestjs/cqrs';
import {
  GET_USER_PLACE_INFO,
  GetUserPlaceInfo,
} from './get-user-place-info.case';
import { IsDefined } from 'class-validator';
import {
  GET_SHORT_USER_PLACE_INFO,
  GetShortUserPlaceInfo,
} from './get-short-user-place-info.case';

export class PlaceServices
  extends AggregateRoot
  implements GetUserPlaceInfo, GetShortUserPlaceInfo
{
  @IsDefined()
  getUserPlaceInfo = GET_USER_PLACE_INFO;

  @IsDefined()
  getShortUserPlaceInfo = GET_SHORT_USER_PLACE_INFO;
}
