import { dishQtyModel, MenuListModel } from './../../shared/model/menu-list.model';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SubscriptionService } from '../../shared/subscription.service';
import { Subscription } from 'rxjs';
export class displayCategory {
  categoryName: string;
  menus: MenuListModel[];
  constructor(params?: displayCategory) {
    this.categoryName = params?.categoryName || '';
    this.menus = params?.menus || [];
  }
}
@Component({
  selector: 'jhi-dish-category',
  templateUrl: './dish-category.component.html',
  styleUrls: ['./dish-category.component.scss'],
})
export class DishCategoryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() menus?: MenuListModel[];
  showDescription: boolean = true;
  category: displayCategory[] = [];
  singleCategory: displayCategory = new displayCategory();
  detailRecivedSubscription: Subscription = new Subscription();
  orderList: dishQtyModel[] = [];
  constructor(protected subscriptionService: SubscriptionService, protected cd: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    //this.createDisplayCategory();
    console.log('inide on changes of category');
  }
  createDisplayCategory() {
    this.menus?.forEach(res => {
      if (this.category.length == 0) {
        this.singleCategory.categoryName = res?.dish?.category?.categoryName || '';
        this.singleCategory.menus.push(res);
        this.category.push(this.singleCategory);
        this.singleCategory = new displayCategory();
      } else {
        if (this.category.find(obj => obj.categoryName === res?.dish?.category?.categoryName)) {
          let index = this.category.findIndex(x => x.categoryName === res?.dish?.category?.categoryName);
          this.category[index].menus.push(res);
        } else {
          this.singleCategory.categoryName = res?.dish?.category?.categoryName || '';
          this.singleCategory.menus.push(res);
          this.category.push(this.singleCategory);
          this.singleCategory = new displayCategory();
        }
      }
    });
  }
  ngOnInit(): void {
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: dishQtyModel[]) => {
      if (obj.length != 0) {
        this.orderList = obj;
        this.cd.detectChanges();
        //this.updateMenuCategoryDishes()
      } else {
        this.orderList = [];
      }
    });
  }

  ngOnDestroy() {
    this.detailRecivedSubscription.unsubscribe();
  }

  updateMenuCategoryDishes() {
    console.log('category=>', this.category);
    this.category.forEach(res => {
      this.orderList.forEach(order => {
        res.menus.forEach(catMenu => {
          order.menus.forEach(ordMenu => {
            if (ordMenu.id == catMenu.id) {
              catMenu = ordMenu;
            }
          });
        });
      });
    });
    console.log('orders=>', this.category);
  }
}
