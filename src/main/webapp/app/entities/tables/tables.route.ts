import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITables, Tables } from 'app/shared/model/tables.model';
import { TablesService } from './tables.service';
import { TablesComponent } from './tables.component';
import { TablesDetailComponent } from './tables-detail.component';
import { TablesUpdateComponent } from './tables-update.component';

@Injectable({ providedIn: 'root' })
export class TablesResolve implements Resolve<ITables> {
  constructor(private service: TablesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITables> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((tables: HttpResponse<Tables>) => {
          if (tables.body) {
            return of(tables.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tables());
  }
}

export const tablesRoute: Routes = [
  {
    path: '',
    component: TablesComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'orderManagementSystemApp.tables.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TablesDetailComponent,
    resolve: {
      tables: TablesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'orderManagementSystemApp.tables.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TablesUpdateComponent,
    resolve: {
      tables: TablesResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.tables.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TablesUpdateComponent,
    resolve: {
      tables: TablesResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.tables.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
