import { AggregateRoot } from '@nestjs/cqrs';
import { IsDefined } from 'class-validator';
import { SET_DESCRIPTION, SetDescription } from './set-description.case';
import { COMPARE_PASSWORDS, ComparePasswords } from './compare-passwords.case';
import { SET_PLACE, SetPlace } from './set-place.case';
import { SET_DISTANCE, SetDistance } from './set-distance.case';
import {
  GET_PRIMITIVE_FIELDS,
  GetPrimitiveFields,
} from './get-primitive-fields.case';
import { GET_RESPONSE_USER, GetResponseUser } from './get-response-user.case';
import {
  GET_SHORT_USER_WITH_DISTANCE,
  GetShortUserWithDistance,
} from './get-short-user-with-distance.case';

export class UserServices
  extends AggregateRoot
  implements
    SetDescription,
    ComparePasswords,
    SetPlace,
    SetDistance,
    GetPrimitiveFields,
    GetResponseUser,
    GetShortUserWithDistance
{
  @IsDefined()
  setDescription = SET_DESCRIPTION;

  @IsDefined()
  comparePasswords = COMPARE_PASSWORDS;

  @IsDefined()
  setPlace = SET_PLACE;

  @IsDefined()
  setDistance = SET_DISTANCE;

  @IsDefined()
  getPrimitiveFields = GET_PRIMITIVE_FIELDS;

  @IsDefined()
  getResponseUser = GET_RESPONSE_USER;

  @IsDefined()
  getShortUserWithDistance = GET_SHORT_USER_WITH_DISTANCE;
}
