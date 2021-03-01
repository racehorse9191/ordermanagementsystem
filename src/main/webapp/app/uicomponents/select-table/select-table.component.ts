import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../core/auth/account.service';
import { TablesService } from '../../entities/tables/tables.service';
import { ITables } from '../../shared/model/tables.model';
import { MatDialog } from '@angular/material/dialog';
import { OrderDailogComponent } from './order-dailog.component';
import { OrderService } from '../../entities/order/order.service';

@Component({
  selector: 'jhi-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['select-table.component.scss'],
})
export class SelectTableComponent implements OnInit {
  tables?: ITables[];
  noTablesOccupied = false;
  noTablesAvailabe = false;

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
    // this.accountService.getAuthenticationState().subscribe(account => {
    //   console.log('account', account);
    //   if (account.authorities.toString().includes('ROLE_CHEF')) {
    //     this.router.navigate(['/ui/cheforderlist']);
    //   } else {
    this.loadAll();
    //   }
    // });
  }
  takeorder(table: any): any {
    let orderData = null;
    // if table is engaged show existing order in dailog
    if (table.tablestatus.includes('ENGAGED')) {
      // calling getOrderBytableId to get data
      this.orderService.getByOrderTableId(table.id).subscribe(response => {
        response.body.menuIdsandQty = JSON.parse(response.body.menuIdsandQty);
        orderData = response.body;
        const dialogRef = this.dialog.open(OrderDailogComponent, {
          // width: '250px',
          // height: '300px',
          data: orderData,
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('this is result in select table', result);
          if (result == 'Complete') {
            this.loadAll();
          }
        });
      });
    }
    // else render menu page
    else {
      this.router.navigate(['/ui/menu/'], { state: table });
    }
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
      if (this.tables.length == 0) {
        this.noTablesAvailabe = true;
        this.noTablesOccupied = false;
      } else {
        this.noTablesAvailabe = false;
        this.noTablesOccupied = false;
      }
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
      if (this.tables.length == 0) {
        this.noTablesOccupied = true;
        this.noTablesAvailabe = false;
      } else {
        this.noTablesOccupied = false;
        this.noTablesAvailabe = false;
      }
    });
  }
  showAll() {
    this.noTablesOccupied = false;
    this.noTablesAvailabe = false;
    this.loadAll();
  }
}
