import { IMenu } from 'app/shared/model/menu.model';
import { ICategory } from 'app/shared/model/category.model';
import { Type } from 'app/shared/model/enumerations/type.model';

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
