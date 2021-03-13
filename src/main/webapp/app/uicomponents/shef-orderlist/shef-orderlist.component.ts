import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { OrderService } from '../../entities/order/order.service';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';
import { IOrder } from '../../shared/model/order.model';
import * as moment from 'moment';
import { faCheckCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { Account } from './../../core/user/account.model';
import { AccountService } from '../../core/auth/account.service';

@Component({
  selector: 'jhi-chef-orderlist',
  templateUrl: './shef-orderlist.component.html',
  styleUrls: ['./shef-orderlist.component.scss'],
})
export class ShefOrderlist {
  account!: Account;
  orders: IOrder[];
  isDishReady: any[] = [];
  changedOrderStatus: any;
  isSaving: boolean = false;
  faCoffee = faCheckCircle;
  faSyncAlt = faSyncAlt;
  sub: Subscription;
  constructor(protected orderService: OrderService, private accountService: AccountService) {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  loadAll(): void {
    this.orderService.getByOrderStatus(OrderStatus.CONFIRMED).subscribe(
      (res: HttpResponse<IOrder[]>) => {
        let orders = [];
        this.orders = [];
        orders = res.body || [];
        orders.forEach((order, index) => {
          this.isDishReady[index] = [];
          order.menuIdsandQty.forEach((menu, i) => {
            if (!menu.isDishReady) {
              this.isDishReady[index][i] = false;
            } else {
              this.isDishReady[index][i] = menu.isDishReady;
            }
          });
        });

        this.orders = this.authoritiesOrder(orders);
      },
      error => {
        console.log('error=>', error);
      }
    );
  }
  ngOnInit(): void {
    this.sub = interval(30000).subscribe(val => {
      this.loadAll();
    });
    this.loadAll();
  }
  onDishChanged(i, j) {
    const orders = JSON.parse(JSON.stringify(this.orders));
    orders.forEach((res, index) => {
      if (index == i) {
        res.menuIdsandQty.forEach((menu, menuIndex) => {
          if (menuIndex == j) {
            menu.isDishReady = this.isDishReady[i][j];
          }
        });
        res.menuIdsandQty = JSON.stringify(res.menuIdsandQty);
        res.orderDate = moment(res.orderDate);
        this.subscribeToSaveResponse(this.orderService.update(orders[index]));
      }
    });
    this.loadAll();
  }
  authoritiesOrder(order: IOrder[]) {
    let authority = '';
    if (this.account.authorities) {
      this.account.authorities.forEach(res => {
        if (res == 'ROLE_CHEF') {
          authority = 'ROLE_CHEF';
        }
      });
    }
    if (authority == 'ROLE_CHEF') {
      order.forEach(res => {
        const menuIdQty = [];
        res.menuIdsandQty.forEach(menuIds => {
          if (menuIds.allDishQty) {
            menuIds.allDishQty.forEach(element => {
              if (element.dish.category.categoryName.toLowerCase() != 'beverages') {
                menuIdQty.push(menuIds);
              }
            });
          }
        });
        res.menuIdsandQty = menuIdQty;
      });
    } else {
      order.forEach(res => {
        const menuIdQty = [];
        res.menuIdsandQty.forEach(menuIds => {
          if (menuIds.allDishQty) {
            menuIds.allDishQty.forEach(element => {
              if (element.dish.category.categoryName.toLowerCase() === 'beverages') {
                menuIdQty.push(menuIds);
              }
            });
          }
        });
        res.menuIdsandQty = menuIdQty;
      });
    }
    order = order.filter(res => res.menuIdsandQty.length != 0);
    return order;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updateCompleted() {
    console.log('this is orders', this.orders);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.sub.unsubscribe();
  }
}
