import { Moment } from 'moment';
import { IMenu } from 'app/shared/model/menu.model';
import { ITables } from 'app/shared/model/tables.model';
import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';

export interface IOrder {
  id?: number;
  menuIdsandQty?: string;
  waiterName?: string;
  note?: string;
  orderDate?: Moment;
  orderstatus?: OrderStatus;
  menu?: IMenu;
  tables?: ITables;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public menuIdsandQty?: string,
    public waiterName?: string,
    public note?: string,
    public orderDate?: Moment,
    public orderstatus?: OrderStatus,
    public menu?: IMenu,
    public tables?: ITables
  ) {}
}
