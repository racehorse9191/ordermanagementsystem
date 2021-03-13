import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
import { interval, Observable, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IOrder, Order } from '../../shared/model/order.model';
import { SubscriptionService } from '../../shared/subscription.service';
import { ToastService } from '../../shared/util/toast.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['select-table.component.scss'],
})
export class SelectTableComponent implements OnInit {
  @ViewChild('modal') private modalComponent: ModalComponent;
  @ViewChild('printmodal') private printmodalComponent: ModalComponent;
  @ViewChild('confirmModal') private confirmModalComponent: TemplateRef<any>;
  btnValue = 'Update';
  modalConfig: ModalConfig = {
    modalTitle: 'Order Details',
    closeButtonLabel: 'Add more',
    dismissButtonLabel: this.btnValue,
    disableDismissButton: () => true,
    disablePrintButton: () => true,
    onDismiss: () => true,
    onClose: () => true,
  };
  confirmModalConfig: ModalConfig = {
    modalTitle: 'Confirm Table Empty',
    closeButtonLabel: 'Cancel',
    dismissButtonLabel: 'ok',
    disableDismissButton: () => true,
    onDismiss: () => true,
    onClose: () => true,
    hideEmptyTableButton: () => true,
    hidePrintButton: () => true,
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
  sub: Subscription;
  constructor(
    protected tablesService: TablesService,
    protected orderService: OrderService,
    public dialog: MatDialog,
    private router: Router,
    protected subscriptionService: SubscriptionService,
    private accountService: AccountService,
    public toastService: ToastService
  ) {}

  loadAll(): void {
    this.tablesService.query().subscribe(res => {
      this.tables = res.body;
      this.assignCopy();
      this.getAllConfirmedOrderList();
    });
  }
  ngOnInit(): void {
    this.subscriptionService.updateOrder([]);
    this.loadAll();
    this.sub = interval(30000).subscribe(val => {
      this.loadAll();
    });
  }

  getAllConfirmedOrderList() {
    this.orderService.getByOrderStatus(OrderStatus.CONFIRMED).subscribe(
      (res: HttpResponse<IOrder[]>) => {
        const orders = res.body || [];
        orders.forEach((order, index) => {
          this.tables.forEach(table => {
            if (order.tables.id == table.id) {
              table.waiterName = order.waiterName;
            }
          });
        });
      },
      error => {
        console.log('error=>', error);
      }
    );
  }
  takeorder(table: any): any {
    this.orderData = null;
    this.selectedTable = table;
    // if table is engaged show existing order in dailog
    if (table.tablestatus.includes('ENGAGED')) {
      // calling getOrderBytableId to get data
      this.orderService.getByOrderTableId(table.id).subscribe(response => {
        if (response.body.menuIdsandQty) {
          response.body.menuIdsandQty = JSON.parse(response.body.menuIdsandQty);
          this.orderData = response.body;
          if (this.orderData) {
            const uncheckedDish = this.orderData.menuIdsandQty.filter(dish => dish.isDishReady == true);
            this.orderData.menuIdsandQty.map(dish => {
              if (dish.isDishReady) {
                dish.allDishQty[0].isDishReady = dish.isDishReady;
              }
            });
            if (uncheckedDish.length == this.orderData.menuIdsandQty.length) {
              this.btnValue = 'Complete';
            } else {
              this.btnValue = 'Update';
            }
            if (uncheckedDish.length != 0 && this.btnValue == 'Complete') {
              this.modalConfig = {
                modalTitle: 'Order Details',
                closeButtonLabel: 'Add more',
                dismissButtonLabel: this.btnValue,
                onDismiss: () => true,
                onClose: () => true,
                disableDismissButton: () => true,
                disablePrintButton: () => false,
              };
              this.modalComponent.modalSettings = {
                centered: true,
                scrollable: true,
                size: 'lg',
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
      this.assignCopy();
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
      this.assignCopy();
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
    data.menuIdsandQty.map(dish => {
      if (dish.isDishReady) {
        dish.allDishQty[0].isDishReady = dish.isDishReady;
      }
    });
    if (uncheckedDish.length != 0) {
      this.modalConfig = {
        modalTitle: 'Order Details',
        closeButtonLabel: 'Add more',
        dismissButtonLabel: this.btnValue,
        onDismiss: () => true,
        onClose: () => true,
        disableDismissButton: () => false,
        disablePrintButton: () => true,
      };
    } else {
      this.modalConfig = {
        modalTitle: 'Order Details',
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
        this.modalComponent.close();
        this.loadAll();
      });
    }
  }

  protected onSaveError(): void {
    console.log('in on save error');
    this.sub.unsubscribe();
  }

  onDismissedClicked(event) {
    this.OrderUpdate(this.orderData);
  }
  onCloseClicked(event) {
    if (!this.emptyTableClicked) {
      const temp = [];
      this.orderData.menuIdsandQty.forEach(res => {
        res.allDishQty.forEach(qty => {
          temp.push(qty);
        });
      });
      this.subscriptionService.updateOrder(temp);
      this.router.navigate(['/ui/menu/'], { state: this.selectedTable });
    } else {
      this.emptyTableClicked = false;
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
    this.showStandard();
    this.modalComponent.modalSettings = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      scrollable: true,
      size: 'lg',
    };
  }

  showStandard() {
    this.toastService.show(this.confirmModalComponent, {
      delay: 2000,
      autohide: false,
      headertext: 'Confirm Table Empty',
    });
  }

  totalorderDetails() {
    const total: any[] = [];
    this.orderData.menuIdsandQty.forEach(res => {
      total.push(res.orderTotal);
    });
    return total.reduce((a, b) => a + b, 0);
  }

  onConfirmEmptyTableClicked() {
    this.toastService.removeAll();
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
  onConfirmCloseClicked() {
    this.toastService.removeAll();
    this.modalComponent.modalSettings = {
      backdrop: true,
      keyboard: true,
      centered: true,
      scrollable: true,
      size: 'lg',
    };
    // this.confirmModalComponent.close();
  }
  onBackButtonCLicked() {
    this.toastService.removeAll();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
