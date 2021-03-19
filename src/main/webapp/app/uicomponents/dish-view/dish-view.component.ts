import { MenuListModel, DishQtyModel } from './../../shared/model/menu-list.model';
import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DishToOrder } from '../../shared/model/dish-to-order';
import { SubscriptionService } from '../../shared/subscription.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-dish-view',
  templateUrl: './dish-view.component.html',
  styleUrls: ['./dish-view.component.scss'],
  providers: [NgbCarouselConfig],
})
export class DishViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dishes?: MenuListModel[] = [];
  @Input() showDescription?: boolean = true;
  @Input() todaysSpl?: boolean = false;
  orders: any[] = [];
  dishToOrder: DishToOrder[] = [];
  detailRecivedSubscription: Subscription = new Subscription();
  images: any[] = [];
  nonVegType: string = 'NON_VEG';
  vegType: string = 'VEG';
  selectedQty: any[] = [];
  dishPrice: any[] = [];
  dishesToOrder: MenuListModel[] = [];
  constructor(protected subscriptionService: SubscriptionService, config: NgbCarouselConfig, protected cd: ChangeDetectorRef) {
    config.interval = 5000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.wrap = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.orders = [];
    this.selectedQty = [];
    console.log('on changes=>', this.dishes);
    this.dishes?.forEach((res, i) => {
      if (res.dishQty[0].orderQty) {
        this.orders.push(res.dishQty[0].orderQty);
      } else {
        this.orders.push(0);
      }
      this.selectedQty.push(res.dishQty[0]);
      this.dishPrice[i] = res.price;
      res.dishQty?.forEach((qty, index) => {
        if (index != 0) {
          qty.disabled = true;
        }
      });
    });
  }

  ngOnInit(): void {
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
      console.log('res=>', obj);
      if (obj && obj.length != 0) {
        this.dishesToOrder = obj;
      }
      this.cd.detectChanges();
    });
  }
  ngOnDestroy() {
    this.detailRecivedSubscription.unsubscribe();
  }

  orderPlusClicked(index: any) {
    this.orders[index] = this.orders[index] + 1;
    if (this.orders[index] > 0) {
      if (this.dishes) {
        const temp =
          this.dishes[index]?.dishQty?.filter(res => res?.id == this.selectedQty[index].id).map(mapData => mapData.menus)[0] || {};
        temp[0].dishQty.forEach((qty, i) => {
          if (qty.id == this.selectedQty[index].id) {
            qty.orderQty = this.orders[index];
          }
        });
        console.log('pushing in dishes to order=>', this.dishes[index]);

        this.dishesToOrder.push(this.dishes[index]);
      }
      this.dishesToOrder = this.removeRedundentObjects(this.dishesToOrder);
      console.log('plus clicked=>', this.dishesToOrder);
      this.subscriptionService.updateOrder(this.dishesToOrder);
    }
  }

  suborderPlusClicked(index) {
    console.log('sub index=>', index);

    if (index.orderQty) {
      Object.assign(index.orderQty, index.orderQty++);
    } else {
      index.orderQty = 1;
    }
    this.selectedQty.forEach(res => {
      console.log('plus qty res=>', res);
      if (res.menus[0].dish.id == index.menus[0].dish.id) {
        this.dishesToOrder.push(res.menus[0]);
      }
    });
    this.dishesToOrder = this.removeRedundentObjects(this.dishesToOrder);
    console.log('dishes to order=>', this.dishesToOrder);
    this.subscriptionService.updateOrder(this.dishesToOrder);
  }

  subOrderMinusClicked(index) {
    Object.assign(index.orderQty, index.orderQty--);
    this.selectedQty.forEach(res => {
      if (res.menus[0].dish.id == index.menus[0].dish.id) {
        this.dishesToOrder.push(res.menus[0]);
      }
    });
    this.dishesToOrder = this.removeRedundentObjects(this.dishesToOrder);
    this.subscriptionService.updateOrder(this.dishesToOrder);
  }

  removeRedundentObjects(arr: any[]) {
    const ids = arr.map(o => o.id);
    return arr.filter(({ id }, index) => !ids.includes(id, index + 1));
  }
  orderMinusClicked(index: any) {
    if (this.orders[index] > 0) {
      this.orders[index] = this.orders[index] - 1;
      if (this.dishes) {
        const temp =
          this.dishes[index]?.dishQty?.filter(res => res?.id == this.selectedQty[index].id).map(mapData => mapData.menus)[0] || {};
        temp[0].dishQty.forEach((qty, i) => {
          if (qty.id == this.selectedQty[index].id) {
            qty.orderQty = this.orders[index];
          }
        });
        this.dishesToOrder.push(this.dishes[index]);
      }
      this.dishesToOrder = this.removeRedundentObjects(this.dishesToOrder);
      this.subscriptionService.updateOrder(this.dishesToOrder);
    }
  }
}
