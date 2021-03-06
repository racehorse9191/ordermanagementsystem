import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../core/auth/account.service';
import { TablesService } from '../../entities/tables/tables.service';
import { ITables } from '../../shared/model/tables.model';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../entities/order/order.service';
import { ModalConfig } from '../../shared/model/modal-config.model';
import { ModalComponent } from '../modal/modal.component';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';
import { TableStatus } from '../../shared/model/enumerations/table-status.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IOrder, Order } from '../../shared/model/order.model';
import { SubscriptionService } from '../../shared/subscription.service';

@Component({
  selector: 'jhi-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['select-table.component.scss'],
})
export class SelectTableComponent implements OnInit {
  @ViewChild('modal') private modalComponent: ModalComponent;
  btnValue = 'Update';
  modalConfig: ModalConfig = {
    modalTitle: 'Current Order Details',
    closeButtonLabel: 'Add more',
    dismissButtonLabel: this.btnValue,
    onDismiss: () => true,
    onClose: () => true,
  };
  tables?: ITables[];
  noTablesOccupied = false;
  noTablesAvailabe = false;
  orderData: any;
  isAllChecked;
  filteredItems = [];
  selectedTable;
  constructor(
    protected tablesService: TablesService,
    protected orderService: OrderService,
    public dialog: MatDialog,
    private router: Router,
    protected subscriptionService: SubscriptionService,
    private accountService: AccountService
  ) {}

  loadAll(): void {
    this.tablesService.query().subscribe(res => {
      this.tables = res.body;
      this.assignCopy();
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
    this.orderData = null;
    this.selectedTable = table;
    // if table is engaged show existing order in dailog
    if (table.tablestatus.includes('ENGAGED')) {
      // calling getOrderBytableId to get data
      this.orderService.getByOrderTableId(table.id).subscribe(response => {
        if (response.body.menuIdsandQty) {
          console.log('elemt=>', response.body.menuIdsandQty);
          response.body.menuIdsandQty = JSON.parse(response.body.menuIdsandQty);
          this.orderData = response.body;
          this.modalComponent.open();
        }
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
    this.modalConfig.dismissButtonLabel = this.btnValue;
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

  protected onSaveSuccess(): void {}

  protected onSaveError(): void {
    console.log('in on save error');
  }

  onDismissedClicked(event) {
    this.OrderUpdate(this.orderData);
    if (this.btnValue == 'Complete') {
      this.loadAll();
    }
  }
  onCloseClicked(event) {
    console.log('close clicked');
    const temp = [];
    this.orderData.menuIdsandQty.forEach(res => {
      res.allDishQty.forEach(qty => {
        temp.push(qty);
      });
    });
    this.subscriptionService.updateOrder(temp);
    this.router.navigate(['/ui/menu/'], { state: this.selectedTable });
  }
  assignCopy() {
    this.filteredItems = Object.assign([], this.tables);
  }
  filterItem(Value) {
    if (!Value) {
      this.assignCopy();
    } // when nothing has typed
    this.filteredItems = Object.assign([], this.tables).filter(
      item => item.tableName.toLowerCase().indexOf(Value.target.value.toLowerCase()) > -1
    );
  }
}
