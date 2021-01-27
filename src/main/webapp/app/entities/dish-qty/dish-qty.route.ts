import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IDishQty, DishQty } from 'app/shared/model/dish-qty.model';
import { DishQtyService } from './dish-qty.service';
import { DishQtyComponent } from './dish-qty.component';
import { DishQtyDetailComponent } from './dish-qty-detail.component';
import { DishQtyUpdateComponent } from './dish-qty-update.component';

@Injectable({ providedIn: 'root' })
export class DishQtyResolve implements Resolve<IDishQty> {
  constructor(private service: DishQtyService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDishQty> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((dishQty: HttpResponse<DishQty>) => {
          if (dishQty.body) {
            return of(dishQty.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DishQty());
  }
}

export const dishQtyRoute: Routes = [
  {
    path: '',
    component: DishQtyComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'orderManagementSystemApp.dishQty.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DishQtyDetailComponent,
    resolve: {
      dishQty: DishQtyResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'orderManagementSystemApp.dishQty.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DishQtyUpdateComponent,
    resolve: {
      dishQty: DishQtyResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dishQty.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DishQtyUpdateComponent,
    resolve: {
      dishQty: DishQtyResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dishQty.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
