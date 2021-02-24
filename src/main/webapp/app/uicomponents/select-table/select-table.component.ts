import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../core/auth/account.service';
import { TablesService } from '../../entities/tables/tables.service';
import { ITables } from '../../shared/model/tables.model';
import { MatDialog } from '@angular/material/dialog';
import { OrderDailogComponent } from './order-dailog.component';
import { Observable } from 'rxjs';
import { TableStatus } from '../../shared/model/enumerations/table-status.model';
import { IOrder, Order } from '../../shared/model/order.model';
import { OrderService } from '../../entities/order/order.service';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';
// import { Moment } from 'moment';
// import * as moment from 'moment';

@Component({
  selector: 'jhi-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['select-table.component.scss'],
})
export class SelectTableComponent implements OnInit {
  tables?: ITables[];

  constructor(
    protected tablesService: TablesService,
    protected orderService: OrderService,
    public dialog: MatDialog,
    private router: Router,
    private accountService: AccountService
  ) {}

  loadAll(): void {
    this.tablesService.query().subscribe(res => {
      this.tables = res.body;
    });
  }
  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      console.log('account', account);
      if (account.authorities.toString().includes('ROLE_CHEF')) {
        this.router.navigate(['/ui/cheforderlist']);
      } else {
        this.loadAll();
      }
    });
  }
  takeorder(table: any): any {
    console.log('table select', table);
    let orderData = null;
    // if table is engaged show existing order in dailog
    if (table.tablestatus.includes('ENGAGED')) {
      // calling getOrderBytableId to get data
      this.orderService.getByOrderTableId(table.id).subscribe(response => {
        response.body.menuIdsandQty = JSON.parse(response.body.menuIdsandQty);
        orderData = response.body;
        const dialogRef = this.dialog.open(OrderDailogComponent, {
          width: '250px',
          height: '300px',
          data: orderData,
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            result.menuIdsandQty = JSON.stringify(result.menuIdsandQty);
            this.OrderComplete(result);
          }
        });
      });
    }
    // else render menu page
    else {
      this.router.navigate(['/ui/menu/'], { state: table });
    }
  }

  /**
   *
   * @param data
   * complete order and make the table free
   */
  OrderComplete(data) {
    data.tables.tablestatus = TableStatus.FREE;
    data.orderstatus = OrderStatus.COMPLETED;
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
    this.loadAll();
    // this.isSaving = false;
    // this.router.navigate(['/']);
  }

  protected onSaveError(): void {
    // this.isSaving = false;
  }

  showVacant() {
    this.tablesService.query().subscribe(res => {
      const tabhelper = [];
      res.body.forEach(tab => {
        if (tab.tablestatus && tab.tablestatus.includes('FREE')) {
          tabhelper.push(tab);
        }
      });
      this.tables = tabhelper;
    });
  }
  showOccupied() {
    this.tablesService.query().subscribe(res => {
      const tabhelper = [];
      res.body.forEach(tab => {
        if (tab.tablestatus && tab.tablestatus.includes('ENGAGED')) {
          tabhelper.push(tab);
        }
      });
      this.tables = tabhelper;
    });
  }
  showAll() {
    this.loadAll();
  }
}
