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
  dishesToOrder: DishQtyModel[] = [];
  constructor(protected subscriptionService: SubscriptionService, config: NgbCarouselConfig, protected cd: ChangeDetectorRef) {
    config.interval = 5000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.wrap = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.orders = [];
    this.dishes?.forEach((res, i) => {
      res.dishQty?.forEach(qty => {
        if (qty.orderQty) {
          console.log('orderQty=>', res.dish.dishName);
          this.orders.push(qty.orderQty);
          this.selectedQty.push(qty);
        }
      });
      if (res.dishQty) {
        if (!this.selectedQty[i]) {
          this.selectedQty.push(res.dishQty[0]);
        }
        this.dishPrice[i] = res.price;
      }
      if (!this.orders[i]) {
        this.orders.push(0);
      }
    });
    console.log('dishes=>', this.dishes);
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
        this.dishes[index]?.dishQty?.filter(res => {
          if (res) {
            if (res?.id == this.selectedQty[index].id) {
              res.orderQty = this.orders[index];
            }
          }
        })[0] || {};
        this.dishesToOrder.push(this.dishes[index]);
      }
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
        if (this.dishes) {
          this.dishes[index]?.dishQty?.filter(res => {
            if (res) {
              if (res?.id == this.selectedQty[index].id) {
                res.orderQty = this.orders[index];
              }
            }
          });
        }
        //  this.dishes =  this.dishes.filter(res=> res.id != this.selectedQty[index].id)
        this.dishesToOrder = this.dishesToOrder.filter(res => res.id !== this.selectedQty[index].id) || [];
      } else if (this.dishes) {
        this.dishes[index]?.dishQty?.filter(res => {
          if (res) {
            if (res?.id == this.selectedQty[index].id) {
              res.orderQty = this.orders[index];
            }
          }
        });
        this.dishesToOrder.filter(res => {
          if (res.id === this.selectedQty[index].id) {
            res.orderQty = this.orders[index];
          }
        });
      }
      this.subscriptionService.updateOrder(this.dishesToOrder);
    }
  }
  onQtyChanged(index: any, value: any) {
    if (value.menus.length != 0) {
      this.dishPrice[index] = value.menus[0].price;
      this.orders[index] = 0;
      if (this.dishes) {
        this.dishes[index]?.dishQty?.filter(res => {
          if (res) {
            if (res?.id == this.selectedQty[index].id) {
              res.orderQty = this.orders[index];
            }
          }
        });
      }
      if (this.dishesToOrder) {
        const temp = [];
        this.dishesToOrder.forEach(res => {
          res.menus.forEach(menu => {
            if (value.menus.find(val => menu.id != val.dish.id)) {
              res.orderQty = 0;
              temp.push(res);
            }
            menu.dishQty.forEach(orQty => {
              if (orQty.id == res.id) {
                orQty.orderQty = 0;
              }
            });
          });
        });
        this.dishesToOrder = [];
        this.dishesToOrder = temp;
      }
      this.subscriptionService.updateOrder(this.dishesToOrder);
    }
  }
}
