import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from '../../entities/order/order.service';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';
import { IOrder } from '../../shared/model/order.model';
import * as moment from 'moment';
@Component({
  selector: 'jhi-chef-orderlist',
  templateUrl: './shef-orderlist.component.html',
  styleUrls: ['./shef-orderlist.component.scss'],
})
export class ShefOrderlist {
  completedOrders = [];
  orders: IOrder[];
  isDishReady: any[] = [];
  changedOrderStatus: any;
  isSaving: boolean = false;
  constructor(protected orderService: OrderService) {}

  loadAll(): void {
    this.orderService.getByOrderStatus(OrderStatus.CONFIRMED).subscribe((res: HttpResponse<IOrder[]>) => {
      const orders = res.body || [];
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
      this.orders = orders;
    });
  }
  ngOnInit(): void {
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
        console.log('order=>', orders[i]);
        this.subscribeToSaveResponse(this.orderService.update(orders[index]));
      }
    });
    this.loadAll();
  }
  ngOnDestroy() {}

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
  }
}
