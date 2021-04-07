import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from './order.service';
import { OrderDeleteDialogComponent } from './order-delete-dialog.component';
import { IOrder } from '../../shared/model/order.model';
import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { AccountService } from '../../core/auth/account.service';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-my-orders',
  templateUrl: './my-orders.component.html',
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  orders?: IOrder[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  faCoffee = faCheckCircle;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  status: string = '';

  constructor(
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private accountService: AccountService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    this.activatedRoute.paramMap.subscribe(params => {
      this.status = params.get('status');
      this.accountService.getAuthenticationState().subscribe(account => {
        if (account.authorities.toString().includes('ROLE_ADMIN')) {
          this.orderService.getByOrderStatus(this.status, { page: pageToLoad - 1, size: this.itemsPerPage, sort: this.sort() }).subscribe(
            (res: HttpResponse<IOrder[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
            () => this.onError()
          );
        } else {
          this.orderService
            .getUserOrderHistory(account.id, this.status, { page: pageToLoad - 1, size: this.itemsPerPage, sort: this.sort() })
            .subscribe(
              (res: HttpResponse<IOrder[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
              () => this.onError()
            );
        }
      });
    });
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.registerChangeInOrders();
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    }).subscribe();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOrder): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOrders(): void {
    this.eventSubscriber = this.eventManager.subscribe('orderListModification', () => this.loadPage());
  }

  delete(order: IOrder): void {
    const modalRef = this.modalService.open(OrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.order = order;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IOrder[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/order/myOrders/' + this.status], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.orders = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}