import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from '../../entities/order/order.service';
import { TablesService } from '../../entities/tables/tables.service';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';
import { TableStatus } from '../../shared/model/enumerations/table-status.model';
import { IOrder, Order } from '../../shared/model/order.model';

@Component({
  selector: 'jhi-order-dailog',
  templateUrl: './order-dailog.component.html',
  styleUrls: ['./order-dailog.component.scss'],
})
export class OrderDailogComponent implements OnInit {
  btnValue = 'Update';
  isAllChecked;
  constructor(
    protected tablesService: TablesService,
    protected orderService: OrderService,
    private router: Router,
    public dialogRef: MatDialogRef<OrderDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  /**
   *
   * @param data updates checkbox values and changes button value accordingly
   */
  updateCheckbox(data) {
    this.isAllChecked = [];
    const uncheckedDish = data.menuIdsandQty.filter(dish => dish.isDishReady == true);
    if (uncheckedDish.length == data.menuIdsandQty.length) {
      this.btnValue = 'Complete';
    } else {
      this.btnValue = 'Update';
    }
  }

  /**
   *
   * @param data update order data
   */
  OrderUpdate(data) {
    const order: Order = new Order();
    order.id = data.id;
    order.menuIdsandQty = JSON.stringify(data.menuIdsandQty);
    order.note = data.note;
    order.orderDate = data.orderDate;
    order.tables = data.tables;
    order.waiterName = data.waiterName;
    order.waiterId = data.waiterId;
    order.orderstatus = data.orderstatus;
    if (this.btnValue.includes('Complete')) {
      order.orderstatus = OrderStatus.COMPLETED;
      order.tables.tablestatus = TableStatus.FREE;
    }
    this.tablesService.update(order.tables).subscribe(res => {});
    this.subscribeToSaveResponse(this.orderService.update(order));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.dialogRef.close(this.btnValue);
  }

  protected onSaveError(): void {
    console.log('in on save error');
  }

  AddMoreDishes(data) {
    this.dialogRef.close();
    this.router.navigate(['/ui/menu/']);
  }
}
