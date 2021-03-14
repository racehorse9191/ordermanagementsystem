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
    this.dishes?.forEach((res, i) => {
      let matching = false;
      res.dishQty?.forEach(qty => {
        if (qty.orderQty) {
          matching = true;
          this.orders.push(qty.orderQty);
          this.selectedQty.push(qty);
        }
      });
      if (res.dishQty) {
        if (!matching) {
          this.selectedQty.push(res.dishQty[0]);
          this.orders.push(0);
        }
        this.dishPrice[i] = res.price;
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
        const temp =
          this.dishes[index]?.dishQty?.filter(res => res?.id == this.selectedQty[index].id).map(mapData => mapData.menus)[0] || {};
        temp[0].dishQty.forEach(qty => {
          if (qty.id == this.selectedQty[index].id) {
            qty.orderQty = this.orders[index];
          }
        });
        let found = false;
        this.dishesToOrder.map((mapData, i) => {
          if (mapData.id == this.dishes[index].id) {
            found = true;
            Object.assign(this.dishesToOrder[i], this.dishes[index]);
          }
        });
        if (!found) {
          found = false;
          this.dishesToOrder.push(this.dishes[index]);
        }
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
        // this.dishes =  this.dishes.filter(res=> res.id != this.selectedQty[index].id)
        this.dishesToOrder = this.dishesToOrder.filter(res => res.id !== this.dishes[index].id) || [];
      } else if (this.dishes) {
        this.dishes[index]?.dishQty?.filter(res => {
          if (res) {
            if (res?.id == this.selectedQty[index].id) {
              res.orderQty = this.orders[index];
            }
          }
        });
        this.dishesToOrder.filter(res => {
          res.dishQty.forEach(qty => {
            if (qty.id === this.selectedQty[index].id) {
              if (qty.orderQty) {
                qty.orderQty = this.orders[index];
              }
            }
          });
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
        this.dishesToOrder = this.dishesToOrder.filter(res => value.menus.find(val => res.dish.id != val.dish.id));
      }
      this.subscriptionService.updateOrder(this.dishesToOrder);
    }
  }
}
