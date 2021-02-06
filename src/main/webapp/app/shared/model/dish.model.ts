import { ICategory } from './category.model';
import { Type } from './enumerations/type.model';
import { IMenu } from './menu.model';

export interface IDish {
  id?: number;
  dishName?: string;
  dishDescription?: string;
  dishImageContentType?: string;
  dishImage?: any;
  type?: Type;
  isTodaysSpecial?: boolean;
  menus?: IMenu[];
  category?: ICategory;
}

export class Dish implements IDish {
  constructor(
    public id?: number,
    public dishName?: string,
    public dishDescription?: string,
    public dishImageContentType?: string,
    public dishImage?: any,
    public type?: Type,
    public isTodaysSpecial?: boolean,
    public menus?: IMenu[],
    public category?: ICategory
  ) {
    this.isTodaysSpecial = this.isTodaysSpecial || false;
  }
}
