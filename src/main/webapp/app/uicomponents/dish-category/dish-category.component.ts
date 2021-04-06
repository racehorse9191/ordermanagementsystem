import { DishQtyModel, MenuListModel } from './../../shared/model/menu-list.model';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SubscriptionService } from '../../shared/subscription.service';
import { Subscription } from 'rxjs';
export class DisplayCategory {
  categoryName: string;
  menus: MenuListModel[];
  constructor(params?: DisplayCategory) {
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
  @Input() menus?: DisplayCategory[];
  @Input() allMenus?: MenuListModel[] = [];
  @Input() isQRMenu?: boolean = false;
  showDescription: boolean = true;
  category: DisplayCategory[] = [];
  singleCategory: DisplayCategory = new DisplayCategory();
  detailRecivedSubscription: Subscription = new Subscription();
  orderList: DishQtyModel[] = [];
  constructor(protected subscriptionService: SubscriptionService, protected cd: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: DishQtyModel[]) => {
      if (obj.length != 0) {
        this.orderList = obj;
        this.cd.detectChanges();
      } else {
        this.orderList = [];
      }
    });
  }

  ngOnDestroy() {
    this.detailRecivedSubscription.unsubscribe();
  }
}
