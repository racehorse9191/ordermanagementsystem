import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from '../../entities/order/order.service';
import { TablesService } from '../../entities/tables/tables.service';
import { TableStatus } from '../../shared/model/enumerations/table-status.model';
import { IOrder, Order } from '../../shared/model/order.model';

@Component({
  selector: 'jhi-order-dailog',
  templateUrl: './order-dailog.component.html',
  styleUrls: ['./order-dailog.component.scss'],
})
export class OrderDailogComponent implements OnInit {
  constructor(
    private router: Router,
    protected tablesService: TablesService,
    protected orderService: OrderService,
    public dialogRef: MatDialogRef<OrderDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }
  OrderComplete(data) {
    data.tables.tablestatus = TableStatus.FREE;
    this.tablesService.update(data.tables).subscribe(res => {});
    this.subscribeToSaveResponse(this.orderService.update(data));
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    // this.isSaving = false;
    // this.router.navigate(['/']);
  }

  protected onSaveError(): void {
    // this.isSaving = false;
  }
  updateCompleted() {
    // checkbox selection logic goes here
  }
}
