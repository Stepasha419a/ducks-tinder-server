import { AggregateRoot } from '@nestjs/cqrs';
import {
  GET_PRIMITIVE_FIELDS,
  GetPrimitiveFields,
} from './get-primitive-fields.case';
import { IsDefined } from 'class-validator';

export class ChatServices extends AggregateRoot implements GetPrimitiveFields {
  @IsDefined()
  getPrimitiveFields = GET_PRIMITIVE_FIELDS;
}
