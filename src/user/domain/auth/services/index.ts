import { AggregateRoot } from '@nestjs/cqrs';
import {
  GET_WITHOUT_PRIVATE_FIELDS,
  GetWithoutPrivateFields,
} from './get-without-private-fields.case';
import { IsDefined } from 'class-validator';

export class AuthUserServices
  extends AggregateRoot
  implements GetWithoutPrivateFields
{
  @IsDefined()
  getWithoutPrivateFields = GET_WITHOUT_PRIVATE_FIELDS;
}
