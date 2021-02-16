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
    console.log('on changes of view=>', this.dishes);
    this.dishes?.forEach((res, i) => {
      res.dishQty?.forEach(qty => {
        if (qty.orderQty) {
          this.orders.push(qty.orderQty);
          this.selectedQty.push(qty);
        }
      });
      if (res.dishQty) {
        console.log('res=>', res);
        if (!this.selectedQty[i]) {
          this.selectedQty.push(res.dishQty[0]);
        }
        this.dishPrice[i] = res.price;
      }
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
              console.log('selected Qty=>', this.selectedQty);
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
    console.log('order minus clicked', this.selectedQty[index]);
    if (this.orders[index] > 0) {
      this.orders[index] = this.orders[index] - 1;
      if (this.orders[index] == 0) {
        if (this.dishes) {
          this.dishes[index]?.dishQty?.filter(res => {
            if (res) {
              if (res?.id == this.selectedQty[index].id) {
                res.orderQty = this.orders[index];
                return res;
              }
            }
          });
        }
        this.dishesToOrder = this.dishesToOrder.filter(res => res.id !== this.selectedQty[index].id) || [];
      } else if (this.dishes) {
        this.dishes[index]?.dishQty?.filter(res => {
          if (res) {
            if (res?.id == this.selectedQty[index].id) {
              res.orderQty = this.orders[index];
              return res;
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
    console.log('inisde qty changed=>', this.selectedQty[index], this.dishes);
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
      console.log('dishes =>', this.dishes);
      if (this.dishesToOrder) {
        const temp = [];
        this.dishesToOrder.forEach(res => {
          console.log('res=>', res);
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
      console.log('dishesToOrder=>', this.dishesToOrder);
      this.subscriptionService.updateOrder(this.dishesToOrder);
    }
  }
}
