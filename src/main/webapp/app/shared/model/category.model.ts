import { IDish } from 'app/shared/model/dish.model';

export interface ICategory {
  id?: number;
  categoryName?: string;
  dishes?: IDish[];
}

export class Category implements ICategory {
  constructor(public id?: number, public categoryName?: string, public dishes?: IDish[]) {}
}
