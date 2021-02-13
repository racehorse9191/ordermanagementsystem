import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { DishQtyService } from './dish-qty.service';
import { DishQty, IDishQty } from '../../shared/model/dish-qty.model';

@Component({
  selector: 'jhi-dish-qty-update',
  templateUrl: './dish-qty-update.component.html',
})
export class DishQtyUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    qtyName: [null, [Validators.required]],
  });

  constructor(protected dishQtyService: DishQtyService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dishQty }) => {
      this.updateForm(dishQty);
    });
  }

  updateForm(dishQty: IDishQty): void {
    this.editForm.patchValue({
      id: dishQty.id,
      qtyName: dishQty.qtyName,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dishQty = this.createFromForm();
    if (dishQty.id !== undefined) {
      this.subscribeToSaveResponse(this.dishQtyService.update(dishQty));
    } else {
      this.subscribeToSaveResponse(this.dishQtyService.create(dishQty));
    }
  }

  private createFromForm(): IDishQty {
    return {
      ...new DishQty(),
      id: this.editForm.get(['id'])!.value,
      qtyName: this.editForm.get(['qtyName'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDishQty>>): void {
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
}
