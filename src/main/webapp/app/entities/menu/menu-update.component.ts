import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IMenu, Menu } from 'app/shared/model/menu.model';
import { MenuService } from './menu.service';
import { IDish } from 'app/shared/model/dish.model';
import { DishService } from 'app/entities/dish/dish.service';
import { IDishQty } from 'app/shared/model/dish-qty.model';
import { DishQtyService } from 'app/entities/dish-qty/dish-qty.service';

type SelectableEntity = IDish | IDishQty;

@Component({
  selector: 'jhi-menu-update',
  templateUrl: './menu-update.component.html',
})
export class MenuUpdateComponent implements OnInit {
  isSaving = false;
  dishes: IDish[] = [];
  dishqties: IDishQty[] = [];

  editForm = this.fb.group({
    id: [],
    price: [null, [Validators.required]],
    isAvailable: [],
    dish: [],
    dishQty: [],
  });

  constructor(
    protected menuService: MenuService,
    protected dishService: DishService,
    protected dishQtyService: DishQtyService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ menu }) => {
      this.updateForm(menu);

      this.dishService.query().subscribe((res: HttpResponse<IDish[]>) => (this.dishes = res.body || []));

      this.dishQtyService.query().subscribe((res: HttpResponse<IDishQty[]>) => (this.dishqties = res.body || []));
    });
  }

  updateForm(menu: IMenu): void {
    this.editForm.patchValue({
      id: menu.id,
      price: menu.price,
      isAvailable: menu.isAvailable,
      dish: menu.dish,
      dishQty: menu.dishQty,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const menu = this.createFromForm();
    if (menu.id !== undefined) {
      this.subscribeToSaveResponse(this.menuService.update(menu));
    } else {
      this.subscribeToSaveResponse(this.menuService.create(menu));
    }
  }

  private createFromForm(): IMenu {
    return {
      ...new Menu(),
      id: this.editForm.get(['id'])!.value,
      price: this.editForm.get(['price'])!.value,
      isAvailable: this.editForm.get(['isAvailable'])!.value,
      dish: this.editForm.get(['dish'])!.value,
      dishQty: this.editForm.get(['dishQty'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMenu>>): void {
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
