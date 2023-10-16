import { AggregateRoot } from '@nestjs/cqrs';
import { SET_DESCRIPTION, SetDescription } from './set-description.case';

export class UserServices extends AggregateRoot implements SetDescription {
  setDescription = SET_DESCRIPTION;
}
