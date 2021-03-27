import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from '../../entities/order/order.service';
import { OrderStatus } from '../../shared/model/enumerations/order-status.model';
import { IOrder } from '../../shared/model/order.model';
import * as moment from 'moment';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../../core/auth/account.service';
import { ActivatedRoute } from '@angular/router';
import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { MenuService } from '../../entities/menu/menu.service';
import { IMenu } from '../../shared/model/menu.model';
import { MenuListModel } from '../../shared/model/menu-list.model';
@Component({
  selector: 'jhi-my-orderlist',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrderlist {
  completedOrders = [];
  orders: IOrder[];
  isDishReady: any[] = [];
  changedOrderStatus: any;
  isSaving: boolean = false;
  faCoffee = faCheckCircle;
  status = 'CONFIRMED';
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  ngbPaginationPage = 1;
  page!: number;
  loggedIndUser: any;
  firstPage = {
    page: 0,
    size: this.itemsPerPage,
    sort: 'id,desc',
  };
  menus: MenuListModel[];
  constructor(
    protected orderService: OrderService,
    protected menuService: MenuService,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  /**
   *
   * @param id Loads all orders by id and status (for user)
   * @param status
   */
  loadAllByIdAndStatus(id, status, pageReq): void {
    this.orders = [];
    this.orderService.getUserOrderHistory(id, status, pageReq).subscribe((res: HttpResponse<IOrder[]>) => {
      const orders = res.body || [];
      this.menuService.query().subscribe((response: HttpResponse<IMenu[]>) => {
        this.menus = response.body || [];
        orders.forEach((order, index) => {
          this.isDishReady[index] = [];
          const tempDish = [];
          order.menuIdsandQty.forEach((menu, i) => {
            this.menus.forEach(dish => {
              if (dish.id == menu.menuId) {
                dish.dishQty.orderQty = menu.orderQty;
                dish.isDishReady = menu.isDishReady;
                tempDish.push(dish);
              }
              if (!menu.isDishReady) {
                this.isDishReady[index][i] = false;
              } else {
                this.isDishReady[index][i] = menu.isDishReady;
              }
            });
          });
          order.menuIdsandQty = tempDish;
        });
        this.orders = orders;
      });
      console.log('orders=>', this.orders);
    });
  }

  /**
   *
   * @param status Loads all orders by status (for admin)
   */
  loadAllByStatus(status): void {
    this.orders = [];
    this.orderService.getByOrderStatus(status).subscribe((res: HttpResponse<IOrder[]>) => {
      const orders = res.body || [];
      this.menuService.query().subscribe((response: HttpResponse<IMenu[]>) => {
        this.menus = response.body || [];
        orders.forEach((order, index) => {
          this.isDishReady[index] = [];
          const tempDish = [];
          order.menuIdsandQty.forEach((menu, i) => {
            this.menus.forEach(dish => {
              if (dish.id == menu.menuId) {
                dish.dishQty.orderQty = menu.orderQty;
                dish.isDishReady = menu.isDishReady;
                tempDish.push(dish);
              }
              if (!menu.isDishReady) {
                this.isDishReady[index][i] = false;
              } else {
                this.isDishReady[index][i] = menu.isDishReady;
              }
            });
          });
          order.menuIdsandQty = tempDish;
        });
        this.orders = orders;
      });
      console.log('orders=>', this.orders);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.status = params.get('status');
      this.accountService.getAuthenticationState().subscribe(account => {
        this.loggedIndUser = account;
        if (account.authorities.toString().includes('ROLE_ADMIN')) {
          this.loadAllByStatus(this.status);
        } else {
          this.loadAllByIdAndStatus(account.id, this.status, this.firstPage);
        }
      });
    });
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

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    const pageReq = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: 'id,desc',
    };
    this.loadAllByIdAndStatus(this.loggedIndUser, this.status, pageReq);
    //   .subscribe(
    //     (res: HttpResponse<IOrder[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
    //     () => this.onError()
    //   );
  }
}
