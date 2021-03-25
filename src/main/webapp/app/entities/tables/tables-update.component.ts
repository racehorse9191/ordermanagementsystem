import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { TablesService } from './tables.service';
import { ITables, Tables } from '../../shared/model/tables.model';

@Component({
  selector: 'jhi-tables-update',
  templateUrl: './tables-update.component.html',
})
export class TablesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    tableName: [null, [Validators.required]],
    tablestatus: [],
  });

  constructor(protected tablesService: TablesService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tables }) => {
      this.updateForm(tables);
    });
  }

  updateForm(tables: ITables): void {
    this.editForm.patchValue({
      id: tables.id,
      tableName: tables.tableName,
      tablestatus: tables.tablestatus,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tables = this.createFromForm();
    if (tables.id !== undefined) {
      this.subscribeToSaveResponse(this.tablesService.update(tables));
    } else {
      this.subscribeToSaveResponse(this.tablesService.create(tables));
    }
  }

  private createFromForm(): ITables {
    return {
      ...new Tables(),
      id: this.editForm.get(['id'])!.value,
      tableName: this.editForm.get(['tableName'])!.value,
      tablestatus: this.editForm.get(['tablestatus'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITables>>): void {
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
