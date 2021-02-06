import { IMenu } from './menu.model';

export interface IDishQty {
  id?: number;
  qtyName?: string;
  menus?: IMenu[];
}

export class DishQty implements IDishQty {
  constructor(public id?: number, public qtyName?: string, public menus?: IMenu[]) {}
}
