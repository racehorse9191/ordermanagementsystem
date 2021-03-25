import { Moment } from 'moment';
import { OrderStatus } from './enumerations/order-status.model';
import { IMenu } from './menu.model';
import { ITables } from './tables.model';

export interface IOrder {
  id?: number;
  menuIdsandQty?: any;
  waiterName?: string;
  waiterId?: number;
  note?: string;
  orderDate?: Moment;
  orderstatus?: OrderStatus;
  menu?: IMenu;
  tables?: ITables;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public menuIdsandQty?: any,
    public waiterName?: string,
    public waiterId?: number,
    public note?: string,
    public orderDate?: Moment,
    public orderstatus?: OrderStatus,
    public menu?: IMenu,
    public tables?: ITables
  ) {}
}
