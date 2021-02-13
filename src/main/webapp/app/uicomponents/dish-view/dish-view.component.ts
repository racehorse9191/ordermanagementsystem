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
  selectedQty: any = [];
  dishPrice: any = [];
  dishesToOrder: DishQtyModel[] = [];
  constructor(protected subscriptionService: SubscriptionService, config: NgbCarouselConfig, protected cd: ChangeDetectorRef) {
    config.interval = 5000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.wrap = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('inide on changes of dish view ');
    this.orders = [];
    this.dishes?.forEach((res, i) => {
      if (res.dishQty) {
        this.selectedQty[i] = res.dishQty[0];
        this.dishPrice[i] = res.price;
      }
      res.dishQty?.forEach(qty => {
        if (qty.orderQty) {
          this.orders.push(qty.orderQty);
        }
      });
      if (!this.orders[i]) {
        this.orders.push(0);
      }
    });
  }

  ngOnInit(): void {
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
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
        let temp =
          this.dishes[index]?.dishQty?.filter(res => {
            if (res) {
              if (res?.id == this.selectedQty[index].id) {
                res.orderQty = this.orders[index];
                return res;
              }
            }
          })[0] || {};
        this.dishesToOrder.push(temp);
        temp = {};
      }
      console.log('res outside=>', this.dishesToOrder);
      this.dishesToOrder = this.removeRedundentObjects(this.dishesToOrder);
      this.subscriptionService.updateOrder(this.dishesToOrder);
    }
  }

  removeRedundentObjects(arr: any[]) {
    return arr.filter(function (item, index) {
      return arr.indexOf(item) >= index;
    });
  }
  orderMinusClicked(index: any) {
    if (this.orders[index] > 0) {
      this.orders[index] = this.orders[index] - 1;
      if (this.orders[index] == 0) {
        this.dishesToOrder = this.dishesToOrder.filter(res => res.id !== this.selectedQty[index].id) || [];
        this.subscriptionService.updateOrder(this.dishesToOrder);
      }
    }
  }
  onQtyChanged(index: any, value: any) {
    if (value.menus.length != 0) {
      this.dishPrice[index] = value.menus[0].price;
      this.orders[index] = 0;
      let temp = [];
      if (this.dishesToOrder) {
        for (let i = 0; i < this.dishesToOrder.length; i++) {
          if (this.dishesToOrder[i] && this.dishesToOrder[i].menus) {
            const len = this.dishesToOrder[i]?.menus?.length || 0;
            for (let j = 0; j < len; j++) {
              if (
                this.dishesToOrder[i].menus &&
                this.dishesToOrder[i].menus[j] &&
                this.dishesToOrder[i].menus[j].dish &&
                this.dishesToOrder[i].menus[j].dish.id != value.menus[0].dish.id
              ) {
                temp.push(this.dishesToOrder[i]);
              }
            }
          }
        }
      }
      this.dishesToOrder = temp;
      temp = [];
      this.subscriptionService.updateOrder(this.dishesToOrder);
    }
  }
}
