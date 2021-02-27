import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from '../../entities/order/order.service';
import { TablesService } from '../../entities/tables/tables.service';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';
import { TableStatus } from '../../shared/model/enumerations/table-status.model';
import { IOrder } from '../../shared/model/order.model';

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
    const uncheckedDish = data.menuIdsandQty.filter(dish => dish.isdishReady == true);
    if (uncheckedDish.length == data.menuIdsandQty.length) {
      this.btnValue = 'Complete';
    } else {
      this.btnValue = 'Update';
    }
  }

  OrderUpdate(data) {
    if (this.btnValue.includes('Complete')) {
      data.tables.tablestatus = TableStatus.FREE;
      data.orderstatus = OrderStatus.COMPLETED;
    }
    this.tablesService.update(data.tables).subscribe(res => {});
    data.menuIdsandQty = JSON.stringify(data.menuIdsandQty);
    this.subscribeToSaveResponse(this.orderService.update(data));
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
