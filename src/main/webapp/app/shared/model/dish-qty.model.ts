export interface IDishQty {
  id?: number;
  qtyName?: string;
}

export class DishQty implements IDishQty {
  constructor(public id?: number, public qtyName?: string) {}
}
