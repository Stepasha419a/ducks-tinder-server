import { AggregateRoot } from '@nestjs/cqrs';
import { IsDefined } from 'class-validator';
import { SET_DESCRIPTION, SetDescription } from './set-description.case';
import { SET_PLACE, SetPlace } from './set-place.case';
import { SET_DISTANCE, SetDistance } from './set-distance.case';
import {
  GET_PRIMITIVE_FIELDS,
  GetPrimitiveFields,
} from './get-primitive-fields.case';
import { ADD_PICTURE, AddPicture } from './add-picture.case';
import { DELETE_PICTURE, DeletePicture } from './delete-picture.case';
import {
  SORT_PICTURE_ORDERS,
  SortPictureOrders,
} from './sort-picture-orders.case';
import {
  MIX_PICTURE_ORDERS,
  MixPictureOrders,
} from './mix-picture-orders.case';
import {
  DECREASE_PICTURE_ORDER,
  DecreasePictureOrder,
} from './decrease-picture-order.case';

export class UserServices
  extends AggregateRoot
  implements
    SetDescription,
    SetPlace,
    SetDistance,
    GetPrimitiveFields,
    AddPicture,
    DeletePicture,
    SortPictureOrders,
    MixPictureOrders,
    DecreasePictureOrder
{
  @IsDefined()
  setDescription = SET_DESCRIPTION;

  @IsDefined()
  setPlace = SET_PLACE;

  @IsDefined()
  setDistance = SET_DISTANCE;

  @IsDefined()
  getPrimitiveFields = GET_PRIMITIVE_FIELDS;

  @IsDefined()
  addPicture = ADD_PICTURE;

  @IsDefined()
  deletePicture = DELETE_PICTURE;

  @IsDefined()
  sortPictureOrders = SORT_PICTURE_ORDERS;

  @IsDefined()
  mixPictureOrders = MIX_PICTURE_ORDERS;

  @IsDefined()
  decreasePictureOrder = DECREASE_PICTURE_ORDER;
}
