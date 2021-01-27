import { IOrder } from 'app/shared/model/order.model';
import { TableStatus } from 'app/shared/model/enumerations/table-status.model';

export interface ITables {
  id?: number;
  tableName?: string;
  tablestatus?: TableStatus;
  orders?: IOrder[];
}

export class Tables implements ITables {
  constructor(public id?: number, public tableName?: string, public tablestatus?: TableStatus, public orders?: IOrder[]) {}
}
