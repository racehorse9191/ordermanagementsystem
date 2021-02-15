import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TablesService } from '../../entities/tables/tables.service';
import { ITables } from '../../shared/model/tables.model';

@Component({
  selector: 'jhi-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['select-table.component.scss'],
})
export class SelectTableComponent implements OnInit {
  tables?: ITables[];

  constructor(protected tablesService: TablesService, private router: Router) {}

  loadAll(): void {
    this.tablesService.query().subscribe((res: HttpResponse<ITables[]>) => (this.tables = res.body || []));
  }
  ngOnInit(): void {
    this.loadAll();
  }
  takeorder(table: any): any {
    this.router.navigate(['/ui/menu/', { queryParams: table }]);
  }
}
