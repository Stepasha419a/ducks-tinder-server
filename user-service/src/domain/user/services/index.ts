import { AggregateRoot } from '@nestjs/cqrs';
import { IsDefined } from 'class-validator';
import { SET_DESCRIPTION, SetDescription } from './set-description.case';
import { SET_PLACE, SetPlace } from './set-place.case';
import {
  SET_DISTANCE_BETWEEN_PLACES,
  SetDistanceBetweenPlaces,
} from './set-distance-between-places.case';
import {
  GET_PRIMITIVE_FIELDS,
  GetPrimitiveFields,
} from './get-primitive-fields.case';
import { ADD_PICTURE, AddPicture } from './add-picture.case';
import { DELETE_PICTURE, DeletePicture } from './delete-picture.case';
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
    SetDistanceBetweenPlaces,
    GetPrimitiveFields,
    AddPicture,
    DeletePicture,
    MixPictureOrders,
    DecreasePictureOrder
{
  @IsDefined()
  setDescription = SET_DESCRIPTION;

  @IsDefined()
  setPlace = SET_PLACE;

  @IsDefined()
  setDistanceBetweenPlaces = SET_DISTANCE_BETWEEN_PLACES;

  @IsDefined()
  getPrimitiveFields = GET_PRIMITIVE_FIELDS;

  @IsDefined()
  addPicture = ADD_PICTURE;

  @IsDefined()
  deletePicture = DELETE_PICTURE;

  @IsDefined()
  mixPictureOrders = MIX_PICTURE_ORDERS;

  @IsDefined()
  decreasePictureOrder = DECREASE_PICTURE_ORDER;
}
