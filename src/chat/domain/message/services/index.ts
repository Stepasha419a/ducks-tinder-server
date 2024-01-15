import { AggregateRoot } from '@nestjs/cqrs';
import { IsDefined } from 'class-validator';
import { SET_TEXT, SetText } from './set-text.case';

export class MessageServices extends AggregateRoot implements SetText {
  @IsDefined()
  setText = SET_TEXT;
}
