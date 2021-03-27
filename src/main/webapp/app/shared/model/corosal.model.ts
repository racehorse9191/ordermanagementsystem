export class CorosalModal {
  dishId?: number;
  dishImage?: string;
  dishName?: string;
  dishDescription?: string;
  constructor(dishImage?: string, dishName?: string, dishDescription?: string, dishId?: number) {
    this.dishDescription = dishDescription;
    this.dishImage = dishImage;
    this.dishName = dishName;
    this.dishId = dishId;
  }
}
