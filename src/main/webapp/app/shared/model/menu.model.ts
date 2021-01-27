import { IOrder } from 'app/shared/model/order.model';
import { IDish } from 'app/shared/model/dish.model';
import { IDishQty } from 'app/shared/model/dish-qty.model';

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
