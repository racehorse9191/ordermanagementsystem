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
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
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
      if (res) {
        this.order = new OrderTable();
        this.order.name = res.dish?.dishName;
        this.order.isDishReady = res?.isDishReady;
        if (res.dishQty.length != 0) {
          res.dishQty.forEach(qty => {
            if (qty.orderQty && qty.orderQty != 0) {
              if (qty.menus) {
                qty.menus.forEach(menu => {
                  if (menu.dishQty) {
                    this.order.id = menu.id;
                    this.order.price = menu.price;
                    this.order.allDishQty = qty.menus;
                    menu.dishQty.forEach(menuQty => {
                      if (menuQty.orderQty && menuQty.orderQty != 0) {
                        this.order.dishQty = menuQty.qtyName;
                        this.order.orderQty = menuQty.orderQty;
                        this.order.orderTotal = this.calculateOrderTotal(menu.price, menuQty.orderQty);
                      }
                    });
                  }
                });
              } else {
                this.order.id = res.id;
                this.order.price = res.price;
                this.order.allDishQty = [res];
                this.order.dishQty = qty.qtyName;
                if (qty.orderQty && qty.orderQty != 0) {
                  this.order.dishQty = qty.qtyName;
                  this.order.orderQty = qty.orderQty;
                  this.order.orderTotal = this.calculateOrderTotal(res.price, qty.orderQty);
                }
              }
            }
          });
          this.orderTable.push(this.order);
        }
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
    this.orderService.getByOrderTableId(this.table.id).subscribe(
      response => {
        if (response.body) {
          const order: Order = new Order();
          delete this.table['navigationId'];
          this.table.tablestatus = 'ENGAGED';
          order.id = response.body.id;
          order.menuIdsandQty = this.customStringify(this.orderTable);
          order.note = this.chefNote;
          order.orderDate = response.body.orderDate;
          order.tables = this.table;
          order.waiterName = this.account.firstName + this.account.lastName;
          order.waiterId = this.account.id;
          order.orderstatus = OrderStatus.CONFIRMED;
          this.subscriptionService.updateOrder([]);
          // this.orderService.update()
          this.subscribeToSaveResponse(this.orderService.update(order));
        } else {
          const order: Order = new Order();
          delete this.table['navigationId'];
          this.table.tablestatus = 'ENGAGED';
          order.menuIdsandQty = this.customStringify(this.orderTable);
          order.note = this.chefNote;
          order.orderDate = moment();
          order.tables = this.table;
          order.waiterName = this.account.firstName + this.account.lastName;
          order.waiterId = this.account.id;
          order.orderstatus = OrderStatus.CONFIRMED;
          this.subscriptionService.updateOrder([]);
          // this.orderService.update()
          this.subscribeToSaveResponse(this.orderService.create(order));
        }
      },
      error => {
        console.log('err=>', error);
      }
    );
  }

  customStringify(v) {
    const cache = new Set();
    v.forEach(res => {
      res.allDishQty.forEach(dish => {
        delete dish.dish.dishImage;
        dish.dishQty.forEach(qty => {
          if (qty.menus) {
            qty.menus.forEach(element => {
              delete element.dish.dishImage;
            });
          }
        });
      });
    });
    return JSON.stringify(v, function (key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          // Circular reference found
          try {
            // If this value does not reference a parent it can be deduped
            return JSON.parse(JSON.stringify(value));
          } catch (err) {
            // discard key if value cannot be deduped
            return;
          }
        }
        // Store value in our set
        cache.add(value);
      }
      return value;
    });
  }
  orderPlusClicked(index: any) {
    this.orderList[index].dishQty.forEach(res => {
      if (res.orderQty) {
        res.orderQty = res.orderQty + 1;
      }
    });
    this.subscriptionService.updateOrder(this.orderList);
  }
  orderMinusClicked(ordrQty: any, index: any) {
    if (ordrQty > 0) {
      const menuId = this.orderList[index].id;
      let deleteIndex = false;
      this.orderList[index].dishQty.forEach(res => {
        if (res.orderQty) {
          res.orderQty = res.orderQty - 1;
          if (res.orderQty == 0) {
            deleteIndex = true;
          }
        }
      });
      this.subscriptionService.updateOrder(this.orderList);
      if (deleteIndex) {
        this.orderList = this.orderList.filter(menu => menu.id != menuId);
      }
      this.subscriptionService.updateOrder(this.orderList);
    }
  }

  onQtyChanged(opt1: any, opt2: any) {}
  delete(order: any) {
    this.orderList = this.orderList.filter(res => res.id != order.id);
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
