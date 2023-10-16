import { User } from '../user.interface';

export interface SetDescription {
  setDescription(description?: string): void;
}

export const SET_DESCRIPTION = async function (
  this: User,
  description?: string,
) {
  if (!description) {
    this.description = null;
  } else {
    this.description = description;
  }
};
