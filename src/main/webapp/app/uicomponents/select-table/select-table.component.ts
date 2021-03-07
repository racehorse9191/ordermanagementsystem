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
  @ViewChild('printmodal') private printmodalComponent: ModalComponent;
  btnValue = 'Update';
  modalConfig: ModalConfig = {
    modalTitle: 'Current Order Details',
    closeButtonLabel: 'Add more',
    dismissButtonLabel: this.btnValue,
    disableDismissButton: () => true,
    disablePrintButton: () => true,
    onDismiss: () => true,
    onClose: () => true,
  };
  printModalConfig: ModalConfig = {
    modalTitle: '',
    hideCloseButton: () => true,
    hideDismissButton: () => true,
    hideEmptyTableButton: () => true,
    hidePrintButton: () => true,
  };
  tables?: ITables[];
  noTablesOccupied = false;
  noTablesAvailabe = false;
  orderData: any;
  isAllChecked;
  filteredItems = [];
  selectedTable;
  emptyTableClicked = false;
  today: Date = new Date();
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
    this.subscriptionService.updateOrder([]);
    this.loadAll();
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
          if (this.orderData) {
            const uncheckedDish = this.orderData.menuIdsandQty.filter(dish => dish.isDishReady == true);
            if (uncheckedDish.length == this.orderData.menuIdsandQty.length) {
              this.btnValue = 'Complete';
            } else {
              this.btnValue = 'Update';
            }
            if (uncheckedDish.length != 0 && this.btnValue == 'Complete') {
              this.modalConfig = {
                modalTitle: 'Current Order Details',
                closeButtonLabel: 'Add more',
                dismissButtonLabel: this.btnValue,
                onDismiss: () => true,
                onClose: () => true,
                disableDismissButton: () => true,
                disablePrintButton: () => false,
              };
            }
          }
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
    if (uncheckedDish.length != 0) {
      this.modalConfig = {
        modalTitle: 'Current Order Details',
        closeButtonLabel: 'Add more',
        dismissButtonLabel: this.btnValue,
        onDismiss: () => true,
        onClose: () => true,
        disableDismissButton: () => false,
        disablePrintButton: () => true,
      };
    } else {
      this.modalConfig = {
        modalTitle: 'Current Order Details',
        closeButtonLabel: 'Add more',
        dismissButtonLabel: this.btnValue,
        onDismiss: () => true,
        onClose: () => true,
        disableDismissButton: () => true,
        disablePrintButton: () => false,
      };
    }
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
    this.subscribeToSaveResponse(this.orderService.update(order));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    if (this.emptyTableClicked) {
      this.orderData.tables.tablestatus = TableStatus.FREE;
      this.tablesService.update(this.orderData.tables).subscribe(res => {
        if (this.btnValue == 'Complete') {
          this.loadAll();
          this.modalComponent.close();
        }
      });
    }
  }

  protected onSaveError(): void {
    console.log('in on save error');
  }

  onDismissedClicked(event) {
    this.OrderUpdate(this.orderData);
  }
  onCloseClicked(event) {
    console.log('close clicked');
    if (!this.emptyTableClicked) {
      const temp = [];
      this.orderData.menuIdsandQty.forEach(res => {
        res.allDishQty.forEach(qty => {
          temp.push(qty);
        });
      });
      this.subscriptionService.updateOrder(temp);
      this.router.navigate(['/ui/menu/'], { state: this.selectedTable });
    }
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

  onPrintBtnClick() {
    this.emptyTableClicked = true;
    this.modalComponent.close();
    this.printmodalComponent.open();
    this.orderData;
    // this.router.navigate(['/ui/print']);
  }
  onPrintClose() {
    this.printmodalComponent.close();
  }
  onEmptyTableclicked() {
    const order: Order = new Order();
    this.emptyTableClicked = true;
    const menuIdsQty = JSON.stringify(this.orderData.menuIdsandQty);
    order.id = this.orderData.id;
    order.menuIdsandQty = menuIdsQty;
    order.note = this.orderData.note;
    order.orderDate = this.orderData.orderDate;
    order.tables = this.orderData.tables;
    order.waiterName = this.orderData.waiterName;
    order.waiterId = this.orderData.waiterId;
    order.orderstatus = this.orderData.orderstatus;
    order.orderstatus = OrderStatus.COMPLETED;
    this.subscribeToSaveResponse(this.orderService.update(order));
  }

  totalorderDetails() {
    const total: any[] = [];
    this.orderData.menuIdsandQty.forEach(res => {
      total.push(res.orderTotal);
    });
    return total.reduce((a, b) => a + b, 0);
  }
}
