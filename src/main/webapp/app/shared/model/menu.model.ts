import { IDishQty } from './dish-qty.model';
import { IDish } from './dish.model';
import { IOrder } from './order.model';

export interface IMenu {
  id?: number;
  price?: string;
  isAvailable?: boolean;
  orders?: IOrder[];
  dish?: IDish;
  dishQty?: IDishQty;
}

export class Menu implements IMenu {
  constructor(
    public id?: number,
    public price?: string,
    public isAvailable?: boolean,
    public orders?: IOrder[],
    public dish?: IDish,
    public dishQty?: IDishQty
  ) {
    this.isAvailable = this.isAvailable || false;
  }
}
