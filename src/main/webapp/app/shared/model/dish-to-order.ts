import { IMenu } from './menu.model';
export class DishToOrder {
  dishDetails?: IMenu;
  dishQty: number;

  constructor(params?: DishToOrder) {
    this.dishDetails = params?.dishDetails;
    this.dishQty = params?.dishQty || 0;
  }
}
