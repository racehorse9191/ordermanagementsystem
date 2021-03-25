import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IMenu } from '../../shared/model/menu.model';
import { ITables } from '../../shared/model/tables.model';
import { OrderService } from './order.service';
import { MenuService } from '../menu/menu.service';
import { TablesService } from '../tables/tables.service';
import { IOrder, Order } from '../../shared/model/order.model';

type SelectableEntity = IMenu | ITables;

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;
  menus: IMenu[] = [];
  tables: ITables[] = [];
  orderDateDp: any;

  editForm = this.fb.group({
    id: [],
    menuIdsandQty: [null, [Validators.required]],
    waiterName: [null, [Validators.required]],
    note: [],
    orderDate: [],
    orderstatus: [],
    menu: [],
    tables: [],
  });

  constructor(
    protected orderService: OrderService,
    protected menuService: MenuService,
    protected tablesService: TablesService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.updateForm(order);

      this.menuService.query().subscribe((res: HttpResponse<IMenu[]>) => (this.menus = res.body || []));

      this.tablesService.query().subscribe((res: HttpResponse<ITables[]>) => (this.tables = res.body || []));
    });
  }

  updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      menuIdsandQty: order.menuIdsandQty,
      waiterName: order.waiterName,
      note: order.note,
      orderDate: order.orderDate,
      orderstatus: order.orderstatus,
      menu: order.menu,
      tables: order.tables,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  private createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      menuIdsandQty: this.editForm.get(['menuIdsandQty'])!.value,
      waiterName: this.editForm.get(['waiterName'])!.value,
      note: this.editForm.get(['note'])!.value,
      orderDate: this.editForm.get(['orderDate'])!.value,
      orderstatus: this.editForm.get(['orderstatus'])!.value,
      menu: this.editForm.get(['menu'])!.value,
      tables: this.editForm.get(['tables'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
