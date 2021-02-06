import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from '../../entities/category/category.service';
import { DishService } from '../../entities/dish/dish.service';
import { ICategory } from '../../shared/model/category.model';
import { IDish } from '../../shared/model/dish.model';

@Component({
  selector: 'jhi-dish-category',
  templateUrl: './dish-category.component.html',
  styleUrls: ['./dish-category.component.scss'],
})
export class DishCategoryComponent implements OnInit {
  @Input() todaysSpl: boolean = false;
  categories?: ICategory[];
  dishes?: IDish[];
  groupDishes?: IDish[];
  constructor(protected categoryService: CategoryService, protected dishService: DishService) {
    this.loadCategory();
    this.loadDishes();
  }

  ngOnInit(): void {}

  loadCategory() {
    this.categoryService.query().subscribe((res: HttpResponse<ICategory[]>) => (this.categories = res.body || []));
  }

  loadDishes() {
    this.dishService.query().subscribe((res: HttpResponse<IDish[]>) => {
      this.dishes = res.body || [];
      this.groupDishByCategory();
    });
  }

  groupDishByCategory() {
    this.categories?.forEach(category => {
      category.dishes = [];
      this.dishes?.forEach(dish => {
        if (this.todaysSpl) {
          if (category.id == dish.category?.id && dish.isTodaysSpecial) {
            category.dishes?.push(dish);
          }
        } else {
          if (category.id == dish.category?.id) {
            category.dishes?.push(dish);
          }
        }
      });
    });
    console.log('for each=>', this.categories);
  }
}
