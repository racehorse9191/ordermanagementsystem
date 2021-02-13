import { Moment } from 'moment';
import { OrderStatus } from './enumerations/order-status.model';
import { TableStatus } from './enumerations/table-status.model';
import { Type } from './enumerations/type.model';

export class MenuListModel {
  id?: number;
  price?: string;
  isAvailable?: boolean;
  orders?: OrderModel[];
  dish?: DishModel;
  dishQty?: DishQtyModel[];
  constructor(params?: MenuListModel) {
    console.log('params=>', params);
    this.id = params?.id;
    this.price = params?.price;
    this.orders = params?.orders;
    this.dish = params?.dish;
    this.dishQty = params?.dishQty;
    this.isAvailable = params?.isAvailable || false;
  }
}

export class OrderModel {
  id?: number;
  menuIdsandQty?: string;
  waiterName?: string;
  note?: string;
  orderDate?: Moment;
  orderstatus?: OrderStatus;
  menu?: MenuListModel;
  tables?: TablesModel;
  constructor(params?: OrderModel) {
    this.id = params?.id;
    this.menuIdsandQty = params?.menuIdsandQty;
    this.waiterName = params?.waiterName;
    this.note = params?.note;
    this.orderDate = params?.orderDate;
    this.orderstatus = params?.orderstatus;
    this.menu = params?.menu;
    this.tables = params?.tables;
  }
}

export class DishModel {
  id?: number;
  dishName?: string;
  dishDescription?: string;
  dishImageContentType?: string;
  dishImage?: any;
  type?: Type;
  isTodaysSpecial?: boolean;
  menus?: MenuListModel[];
  category?: CategoryModel;
  constructor(params?: DishModel) {
    this.id = params?.id;
    this.dishName = params?.dishName;
    this.dishDescription = params?.dishDescription;
    this.dishImageContentType = params?.dishImageContentType;
    this.dishImage = params?.dishImage;
    this.type = params?.type;
    this.menus = params?.menus;
    this.category = params?.category;
    this.isTodaysSpecial = params?.isTodaysSpecial || false;
  }
}

export class CategoryModel {
  id?: number;
  categoryName?: string;
  dishes?: DishModel[];
  constructor(params?: CategoryModel) {
    this.id = params?.id;
    this.categoryName = params?.categoryName;
    this.dishes = params?.dishes;
  }
}
export class DishQtyModel {
  id?: number;
  qtyName?: string;
  menus?: MenuListModel[];
  orderQty?: number;
  constructor(params?: DishQtyModel) {
    this.id = params?.id;
    this.qtyName = params?.qtyName;
    this.menus = params?.menus || [];
    this.orderQty = params?.orderQty;
  }
}

export class TablesModel {
  id?: number;
  tableName?: string;
  tablestatus?: TableStatus;
  orders?: OrderModel[];
  constructor(params?: TablesModel) {
    this.id = params?.id;
    this.tableName = params?.tableName;
    this.tablestatus = params?.tablestatus;
    this.orders = params?.orders || [];
  }
}
