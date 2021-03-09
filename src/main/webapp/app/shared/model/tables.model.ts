import { TableStatus } from './enumerations/table-status.model';
import { IOrder } from './order.model';

export interface ITables {
  id?: number;
  tableName?: string;
  tablestatus?: TableStatus;
  orders?: IOrder[];
  waiterName?: string;
}

export class Tables implements ITables {
  constructor(
    public id?: number,
    public tableName?: string,
    public tablestatus?: TableStatus,
    public orders?: IOrder[],
    public waiterName?: string
  ) {}
}
