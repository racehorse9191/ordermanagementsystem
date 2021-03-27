export class QtyGroupModel {
  dishId?: number;
  quantities?: QuantitiesModel[];
  constructor(dishId?: number, quantities?: QuantitiesModel[]) {
    this.quantities = quantities || [];
    this.dishId = dishId;
  }
}
export class QuantitiesModel {
  menuId?: number;
  qtyName?: string;
  orderQty?: number;
  qtyId?: number;
  price?: string;
  disabled?: boolean;
  constructor(menuId?: number, qtyName?: string, orderQty?: number, qtyId?: number, price?: string, disabled?: boolean) {
    this.menuId = menuId;
    this.qtyName = qtyName;
    this.orderQty = orderQty;
    this.qtyId = qtyId;
    this.price = price;
    this.disabled = disabled;
  }
}
