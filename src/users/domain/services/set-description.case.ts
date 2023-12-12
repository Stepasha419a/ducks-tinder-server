import { User } from '../user.interface';

export interface SetDescription {
  setDescription(description?: string): void;
}

export async function SET_DESCRIPTION(this: User, description?: string) {
  if (!description) {
    this.description = null;
  } else {
    this.description = description;
  }
}
