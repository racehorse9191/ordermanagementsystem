import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';
import { LoginModalService } from '../core/login/login-modal.service';
import { LoginService } from '../core/login/login.service';
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
export class HomeComponent implements OnInit, OnDestroy, OnChanges {
  account: Account | null = null;
  authSubscription?: Subscription;
  breakpoint: number | undefined;
  tempArr: any[] = [];
  tables?: ITables[];
  eventSubscriber?: Subscription;
  isLoggedIn: boolean = false;
  @ViewChild('username', { static: false })
  username?: ElementRef;

  authenticationError = false;

  loginForm = this.fb.group({
    username: [''],
    password: [''],
    rememberMe: [false],
  });

  constructor(
    private accountService: AccountService,
    protected eventManager: JhiEventManager,
    private loginModalService: LoginModalService,
    protected tablesService: TablesService,
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.isLoggedIn = this.isAuthenticated();
    if (this.isLoggedIn) {
      this.accountService.getAuthenticationState().subscribe(account => {
        console.log('account', account);
        if (account.authorities.toString().includes('ROLE_CHEF') || account.authorities.toString().includes('ROLE_BARTENDER')) {
          this.router.navigate(['/ui/cheforderlist']);
        } else {
          this.router.navigate(['/ui/selectTable']);
        }
      });
    }
  }

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
    this.accountService.getAuthenticationState().subscribe(account => {
      console.log('account', account);
      if (account) {
        if (account.authorities.toString().includes('ROLE_CHEF') || account.authorities.toString().includes('ROLE_BARTENDER')) {
          this.router.navigate(['/ui/cheforderlist']);
        } else {
          this.router.navigate(['/ui/selectTable']);
        }
      } else {
        this.router.navigate(['']);
        // this.loginModal();
      }
    });
    this.registerChangeInTables();
    this.breakpoint = window.innerWidth <= 400 ? 1 : 6;
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account || null));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  loginModal(): void {
    this.loginModalService.open();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.username) {
      this.username.nativeElement.focus();
    }
  }

  cancel(): void {
    this.authenticationError = false;
    this.loginForm.patchValue({
      username: '',
      password: '',
    });
    // this.activeModal.dismiss('cancel');
  }

  login(): void {
    console.log('in login');
    this.loginService
      .login({
        username: this.loginForm.get('username')!.value,
        password: this.loginForm.get('password')!.value,
        rememberMe: this.loginForm.get('rememberMe')!.value,
      })
      .subscribe(
        () => {
          console.log('in login subscribe');
          this.authenticationError = false;
          // this.activeModal.close();
          if (
            this.router.url === '/account/register' ||
            this.router.url.startsWith('/account/activate') ||
            this.router.url.startsWith('/account/reset/')
          ) {
            this.router.navigate(['home']);
          }
        },
        () => (this.authenticationError = true)
      );
  }

  register(): void {
    // this.activeModal.dismiss('to state register');
    this.router.navigate(['/account/register']);
  }

  requestResetPassword(): void {
    // this.activeModal.dismiss('to state requestReset');
    this.router.navigate(['/account/reset', 'request']);
  }
}
