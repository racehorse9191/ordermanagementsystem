import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from '../../core/auth/account.service';
import { DishQtyModel } from '../../shared/model/menu-list.model';
import { SubscriptionService } from '../../shared/subscription.service';
import { Account } from './../../core/user/account.model';
export class OrderTable {
  id?: number;
  name?: string;
  dishQty?: any;
  orderQty?: any;
  price?: any;
  orderTotal?: any;
  allDishQty?: DishQtyModel[];
  constructor(params?: OrderTable) {
    this.id = params?.id;
    this.name = params?.name;
    this.dishQty = params?.dishQty;
    this.orderQty = params?.orderQty;
    this.price = params?.price;
    this.allDishQty = params?.allDishQty;
    this.orderTotal = params?.orderTotal;
  }
}
@Component({
  selector: 'jhi-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  account!: Account;
  detailRecivedSubscription: Subscription = new Subscription();
  orderList: DishQtyModel[] = [];
  orderTable: OrderTable[] = [];
  order: OrderTable = new OrderTable();
  collapsed = false;
  constructor(protected subscriptionService: SubscriptionService, private router: Router, private accountService: AccountService) {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
  ngOnInit(): void {
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
      if (obj.length != 0) {
        this.orderList = obj;
        console.log('orderList=>', this.orderList);
        this.constructTable();
      } else {
        this.orderTable = [];
      }
    });
  }

  ngOnDestroy() {
    this.detailRecivedSubscription.unsubscribe();
  }

  constructTable() {
    this.orderTable = [];
    this.orderList.forEach(res => {
      if (res.menus) {
        res?.menus?.forEach(menu => {
          this.order = new OrderTable();
          this.order.id = menu.id;
          this.order.dishQty = res.qtyName;
          this.order.orderQty = res.orderQty;
          this.order.name = menu.dish?.dishName;
          this.order.price = menu.price;
          this.order.allDishQty = menu.dishQty;
          this.order.orderTotal = this.calculateOrderTotal(menu.price, res.orderQty);
          this.orderTable.push(this.order);
        });
      }
    });
  }

  calculateOrderTotal(price: any, qty: any) {
    return price * qty;
  }

  totalorderDetails() {
    const total: any[] = [];
    this.orderTable.forEach(res => {
      total.push(res.orderTotal);
    });
    return total.reduce((a, b) => a + b, 0);
  }
  confirmOrder() {
    console.log('order confirmed');
    this.router.navigate(['/']);
  }
  orderPlusClicked(index: any) {}
  orderMinusClicked(index: any) {}

  onQtyChanged(opt1: any, opt2: any) {}
  delete(menu: any) {}
}
