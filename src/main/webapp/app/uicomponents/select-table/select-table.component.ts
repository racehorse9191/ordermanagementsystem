import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../core/auth/account.service';
import { TablesService } from '../../entities/tables/tables.service';
import { ITables } from '../../shared/model/tables.model';

@Component({
  selector: 'jhi-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['select-table.component.scss'],
})
export class SelectTableComponent implements OnInit {
  tables?: ITables[];

  constructor(protected tablesService: TablesService, private router: Router, private accountService: AccountService) {}

  loadAll(): void {
    this.tablesService.query().subscribe(res => {
      console.log('tables res', res);
      this.tables = res.body;
    });
    // this.tablesService.query().subscribe((res: HttpResponse<ITables[]>) => (this.tables = res.body || []));
  }
  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      console.log('account', account);
      if (account.authorities.toString().includes('ROLE_CHEF')) {
        this.router.navigate(['/ui/cheforderlist']);
      } else {
        this.loadAll();
      }
    });
  }
  takeorder(table: any): any {
    this.router.navigate(['/ui/menu/'], { state: table });
  }
  showVacant() {
    this.tablesService.query().subscribe(res => {
      console.log('tables res', res);
      const tabhelper = [];
      res.body.forEach(tab => {
        if (tab.tablestatus && tab.tablestatus.includes('FREE')) {
          tabhelper.push(tab);
        }
      });
      this.tables = tabhelper;
    });
  }
  showOccupied() {
    this.tablesService.query().subscribe(res => {
      console.log('tables res', res);
      const tabhelper = [];
      res.body.forEach(tab => {
        console.log('tables res IN FOR', tab);
        if (tab.tablestatus && tab.tablestatus.includes('ENGAGED')) {
          tabhelper.push(tab);
        }
      });
      this.tables = tabhelper;
    });
  }
  showAll() {
    this.loadAll();
  }
}
