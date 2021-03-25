import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITables } from '../../shared/model/tables.model';

@Component({
  selector: 'jhi-tables-detail',
  templateUrl: './tables-detail.component.html',
})
export class TablesDetailComponent implements OnInit {
  tables: ITables | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tables }) => (this.tables = tables));
  }

  previousState(): void {
    window.history.back();
  }
}
