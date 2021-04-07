import { MenuListModel } from './../../shared/model/menu-list.model';
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
import { MenuService } from '../../entities/menu/menu.service';
import { IMenu } from '../../shared/model/menu.model';

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
  vacantFilter: boolean = false;
  occupiedFilter: boolean = false;
  showAllFilter: boolean = true;
  /* new variables used */
  menus: MenuListModel[];
  constructor(
    protected tablesService: TablesService,
    protected orderService: OrderService,
    public dialog: MatDialog,
    private router: Router,
    protected subscriptionService: SubscriptionService,
    private accountService: AccountService,
    public toastService: ToastService,
    protected menuService: MenuService
  ) {}

  loadAll(): void {
    if (this.showAllFilter) {
      this.tablesService.query().subscribe(res => {
        this.tables = res.body;
        this.assignCopy();
        this.getAllConfirmedOrderList();
      });
    } else if (this.vacantFilter) {
      this.showVacant();
    } else if (this.occupiedFilter) {
      this.showOccupied();
    }
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
          this.menuService.query().subscribe((res: HttpResponse<IMenu[]>) => {
            response.body.menuIdsandQty = JSON.parse(response.body.menuIdsandQty);
            this.menus = res.body || [];
            this.menus.forEach(menu => {
              response.body.menuIdsandQty.forEach(element => {
                if (menu.id == element.menuId) {
                  menu.dishQty.orderQty = element.orderQty;
                  menu.isDishReady = element.isDishReady;
                }
              });
            });
            const menuIdsQty = [];
            this.menus.forEach(menu => {
              if (menu.dishQty.orderQty && menu.dishQty.orderQty != 0) {
                menuIdsQty.push(menu);
              }
            });
            response.body.menuIdsandQty = menuIdsQty;
            this.orderData = response.body;
            console.log('orderData=>', this.orderData);
            if (this.orderData) {
              const uncheckedDish = this.orderData.menuIdsandQty.filter(dish => dish.isDishReady == true);

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
          });
        }
      });
    }
    // else render menu page
    else {
      this.router.navigate(['/ui/menu/'], { state: table });
    }
  }

  showVacant() {
    this.vacantFilter = true;
    this.occupiedFilter = false;
    this.showAllFilter = false;
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
      this.getAllConfirmedOrderList();
    });
  }
  showOccupied() {
    this.vacantFilter = false;
    this.occupiedFilter = true;
    this.showAllFilter = false;
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
      this.getAllConfirmedOrderList();
    });
  }
  showAll() {
    this.vacantFilter = false;
    this.occupiedFilter = false;
    this.showAllFilter = true;
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
    order.menuIdsandQty = JSON.stringify(this.constructMenuIdsQty(data.menuIdsandQty));
    order.note = data.note;
    order.orderDate = data.orderDate;
    order.tables = data.tables;
    order.waiterName = data.waiterName;
    order.waiterId = data.waiterId;
    order.orderstatus = data.orderstatus;
    this.subscribeToSaveResponse(this.orderService.update(order));
  }

  constructMenuIdsQty(v: MenuListModel[]) {
    const menuIdsQty = [];
    v.forEach(element => {
      let dishReady: boolean = false;
      const dishName = element.dish.dishName;
      if (element.isDishReady) {
        dishReady = element.isDishReady;
        // dishName = element.dish.dishName;
      }
      menuIdsQty.push({
        menuId: element.id,
        dishName: dishName,
        dishQty: element.dishQty.qtyName,
        orderQty: element.dishQty.orderQty,
        isDishReady: dishReady,
      });
    });
    return menuIdsQty;
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
      this.subscriptionService.updateOrder(this.menus);
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
      total.push(this.calculateOrderTotal(res.price, res.dishQty.orderQty));
    });
    return total.reduce((a, b) => a + b, 0);
  }

  onConfirmEmptyTableClicked() {
    this.toastService.removeAll();
    const order: Order = new Order();
    this.emptyTableClicked = true;
    const menuIdsQty = JSON.stringify(this.constructMenuIdsQty(this.orderData.menuIdsandQty));
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
  calculateOrderTotal(price: any, qty: any) {
    return price * qty;
  }
  onBackButtonCLicked() {
    this.toastService.removeAll();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
