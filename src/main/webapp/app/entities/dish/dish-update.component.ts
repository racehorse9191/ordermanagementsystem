import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IDish, Dish } from 'app/shared/model/dish.model';
import { DishService } from './dish.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';

@Component({
  selector: 'jhi-dish-update',
  templateUrl: './dish-update.component.html',
})
export class DishUpdateComponent implements OnInit {
  isSaving = false;
  categories: ICategory[] = [];

  editForm = this.fb.group({
    id: [],
    dishName: [null, [Validators.required]],
    dishDescription: [],
    dishImage: [],
    dishImageContentType: [],
    type: [null, [Validators.required]],
    isTodaysSpecial: [],
    category: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected dishService: DishService,
    protected categoryService: CategoryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dish }) => {
      this.updateForm(dish);

      this.categoryService.query().subscribe((res: HttpResponse<ICategory[]>) => (this.categories = res.body || []));
    });
  }

  updateForm(dish: IDish): void {
    this.editForm.patchValue({
      id: dish.id,
      dishName: dish.dishName,
      dishDescription: dish.dishDescription,
      dishImage: dish.dishImage,
      dishImageContentType: dish.dishImageContentType,
      type: dish.type,
      isTodaysSpecial: dish.isTodaysSpecial,
      category: dish.category,
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: any, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('orderManagementSystemApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dish = this.createFromForm();
    if (dish.id !== undefined) {
      this.subscribeToSaveResponse(this.dishService.update(dish));
    } else {
      this.subscribeToSaveResponse(this.dishService.create(dish));
    }
  }

  private createFromForm(): IDish {
    return {
      ...new Dish(),
      id: this.editForm.get(['id'])!.value,
      dishName: this.editForm.get(['dishName'])!.value,
      dishDescription: this.editForm.get(['dishDescription'])!.value,
      dishImageContentType: this.editForm.get(['dishImageContentType'])!.value,
      dishImage: this.editForm.get(['dishImage'])!.value,
      type: this.editForm.get(['type'])!.value,
      isTodaysSpecial: this.editForm.get(['isTodaysSpecial'])!.value,
      category: this.editForm.get(['category'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDish>>): void {
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

  trackById(index: number, item: ICategory): any {
    return item.id;
  }
}
