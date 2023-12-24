import { Message } from '../message.interface';

export interface SetText {
  setText(text: string): Promise<string>;
}

export async function SET_TEXT(this: Message, text: string): Promise<string> {
  this.text = text;
  return this.text;
}
