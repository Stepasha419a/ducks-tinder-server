import * as bcrypt from 'bcryptjs';
import { User } from '../user.interface';

export interface ComparePasswords {
  comparePasswords(passwordToCompare: string): Promise<boolean>;
}

export async function COMPARE_PASSWORDS(this: User, passwordToCompare: string) {
  return bcrypt.compare(passwordToCompare, this.password);
}
