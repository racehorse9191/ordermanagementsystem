import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from '../../core/auth/account.service';
import { OrderService } from '../../entities/order/order.service';
import { TablesService } from '../../entities/tables/tables.service';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';
import { MenuListModel } from '../../shared/model/menu-list.model';
import { IOrder, Order } from '../../shared/model/order.model';
import { SubscriptionService } from '../../shared/subscription.service';
import { Account } from './../../core/user/account.model';
export class OrderTable {
  id?: number;
  name?: string;
  dishQty?: any;
  orderQty?: any;
  price?: any;
  orderTotal?: any;
  allDishQty?: MenuListModel[];
  isDishReady?: boolean;
  constructor(params?: OrderTable) {
    this.id = params?.id;
    this.name = params?.name;
    this.dishQty = params?.dishQty;
    this.orderQty = params?.orderQty;
    this.price = params?.price;
    this.allDishQty = params?.allDishQty;
    this.orderTotal = params?.orderTotal;
    this.isDishReady = params?.isDishReady;
  }
}
@Component({
  selector: 'jhi-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  account!: Account;
  isSaving = false;
  detailRecivedSubscription: Subscription = new Subscription();
  orderList: MenuListModel[] = [];
  orderTable: OrderTable[] = [];
  order: OrderTable = new OrderTable();
  private routeSub: Subscription = new Subscription();
  collapsed = false;
  tableName: string = '';
  chefNote: string = '';
  table: any;
  constructor(
    protected subscriptionService: SubscriptionService,
    protected tablesService: TablesService,
    protected orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.table = history.state;
    });
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
  ngOnInit(): void {
    this.orderTable = [];
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
      console.log('order list=>', obj);
      if (obj.length != 0) {
        this.orderList = obj;
        this.constructTable();
      } else {
        this.orderTable = [];
      }
    });
  }

  ngOnDestroy() {
    this.detailRecivedSubscription.unsubscribe();
    this.routeSub.unsubscribe();
  }

  constructTable() {
    this.orderTable = [];
    this.orderList.forEach(res => {
      if (res.dishQty.orderQty && res.dishQty.orderQty != 0) {
        this.order = new OrderTable();
        this.order.name = res.dish.dishName;
        this.order.isDishReady = res?.isDishReady;
        this.order.id = res.id;
        this.order.price = res.price;
        this.order.orderTotal = this.calculateOrderTotal(res.price, res.dishQty.orderQty);
        this.order.allDishQty = [res];
        this.order.dishQty = res.dishQty.qtyName;
        this.order.orderQty = res.dishQty.orderQty;
        this.orderTable.push(this.order);
      }
    });
    console.log('order table=>', this.orderTable);
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
    this.orderService.getByOrderTableId(this.table.id).subscribe(
      response => {
        if (response.body) {
          const order: Order = new Order();
          delete this.table['navigationId'];
          this.table.tablestatus = 'ENGAGED';
          order.id = response.body.id;
          order.menuIdsandQty = JSON.stringify(this.constructMenuIdsQty(this.orderTable));
          order.note = this.chefNote;
          order.orderDate = response.body.orderDate;
          order.tables = this.table;
          order.waiterName = this.account.firstName + ' ' + this.account.lastName;
          order.waiterId = this.account.id;
          order.orderstatus = OrderStatus.CONFIRMED;
          this.subscriptionService.updateOrder([]);
          this.subscribeToSaveResponse(this.orderService.update(order));
        } else {
          const order: Order = new Order();
          delete this.table['navigationId'];
          this.table.tablestatus = 'ENGAGED';
          order.menuIdsandQty = JSON.stringify(this.constructMenuIdsQty(this.orderTable));
          order.note = this.chefNote;
          order.orderDate = moment();
          order.tables = this.table;
          order.waiterName = this.account.firstName + ' ' + this.account.lastName;
          order.waiterId = this.account.id;
          order.orderstatus = OrderStatus.CONFIRMED;
          this.subscriptionService.updateOrder([]);
          this.subscribeToSaveResponse(this.orderService.create(order));
        }
      },
      error => {
        console.log('err=>', error);
      }
    );
  }

  constructMenuIdsQty(v: OrderTable[]) {
    const menuIdsQty = [];
    v.forEach(element => {
      let dishReady: boolean = false;
      if (element.isDishReady) {
        dishReady = element.isDishReady;
      }
      menuIdsQty.push({ menuId: element.id, orderQty: element.orderQty, isDishReady: dishReady });
    });
    return menuIdsQty;
  }
  orderPlusClicked(order: OrderTable) {
    this.orderList.forEach(orderList => {
      if (orderList.id == order.id) {
        orderList.dishQty.orderQty = orderList.dishQty.orderQty + 1;
        orderList.isDishReady = false;
      }
    });
    this.subscriptionService.updateOrder(this.orderList);
  }

  orderMinusClicked(order: OrderTable) {
    if (order.orderQty > 0) {
      this.orderList.forEach(orderList => {
        if (orderList.id == order.id) {
          orderList.dishQty.orderQty = orderList.dishQty.orderQty - 1;
          orderList.isDishReady = false;
        }
      });
      this.subscriptionService.updateOrder(this.orderList);
    }
  }
  removeRedundentObjects(arr: any[]) {
    const ids = arr.map(o => o.id);
    return arr.filter(({ id }, index) => !ids.includes(id, index + 1));
  }
  delete(order: any) {
    this.orderList.forEach(orderList => {
      if (orderList.id == order.id) {
        orderList.dishQty.orderQty = 0;
      }
    });
    this.subscriptionService.updateOrder(this.orderList);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.tablesService.update(this.table).subscribe(res => {
      this.router.navigate(['/']);
    });
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
