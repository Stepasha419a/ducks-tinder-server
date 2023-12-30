import { Picture } from '../picture.interface';

export interface DecreaseOrder {
  decreaseOrder(): Promise<number>;
}

export async function DECREASE_ORDER(this: Picture): Promise<number> {
  if (this.order > 0) {
    return --this.order;
  }
  return this.order;
}
