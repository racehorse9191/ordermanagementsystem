import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

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

  constructor(private accountService: AccountService, private loginModalService: LoginModalService) {}

  ngOnInit(): void {
    this.breakpoint = window.innerWidth <= 400 ? 1 : 6;
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
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
      console.log('test all tiles=>', this.tiles);
    } else {
      this.tempArr = [];
      this.tiles = [];
      this.alltiles.forEach(x => {
        if (x.color.includes(val)) {
          this.tempArr.push(x);
        }
      });
      console.log('this.tempArr=>', this.tiles);
      this.tiles = this.tempArr;
      console.log('this.tempArrsss=>', this.tiles);
    }
  }
  takeorder(table: any): any {}
}
