import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';
import { LoginModalService } from '../core/login/login-modal.service';
import { TablesService } from '../entities/tables/tables.service';
import { ITables } from '../shared/model/tables.model';
import { Account } from './../core/user/account.model';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  tiles: Tile[] = [
    { text: 'Table_One', cols: 1, rows: 1, color: '#007AFF' },
    { text: 'Table_Two', cols: 1, rows: 1, color: '#007AFF' },
    { text: 'Table_Three', cols: 1, rows: 1, color: '#007AFF' },
    { text: 'Table_Four', cols: 1, rows: 1, color: '#007AFF' },
    { text: 'Table_Five', cols: 1, rows: 1, color: '#007AFF' },
    { text: 'Table_Six', cols: 1, rows: 1, color: '#007AFF' },
    { text: 'Table_Seven', cols: 1, rows: 1, color: '#007AFF' },
    { text: 'Table_Eight', cols: 1, rows: 1, color: '#007AFF' },
  ];

  alltiles = this.tiles;
  breakpoint: number | undefined;
  tempArr: any[] = [];
  tables?: ITables[];
  eventSubscriber?: Subscription;

  constructor(
    private accountService: AccountService,
    protected eventManager: JhiEventManager,
    private loginModalService: LoginModalService,
    protected tablesService: TablesService
  ) {}

  loadAll(): void {
    this.tablesService.query().subscribe((res: HttpResponse<ITables[]>) => (this.tables = res.body || []));
  }

  registerChangeInTables(): void {
    this.eventSubscriber = this.eventManager.subscribe('tablesListModification', () => {
      this.loadAll();
      console.log('this is tables', this.tables);
    });
  }
  ngOnInit(): void {
    this.loadAll();
    console.log('this is tables', this.tables);
    this.registerChangeInTables();
    this.breakpoint = window.innerWidth <= 400 ? 1 : 6;
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account || null));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  onResize(event: any): any {
    this.breakpoint = event.target.innerWidth <= 400 ? 1 : 6;
  }
  filterTables(val: string): any {
    if (val.includes('All')) {
      this.tiles = this.alltiles;
    } else {
      this.tempArr = [];
      this.tiles = [];
      this.alltiles.forEach(x => {
        if (x.color.includes(val)) {
          this.tempArr.push(x);
        }
      });
      this.tiles = this.tempArr;
    }
  }
  takeorder(table: any): any {}
}
