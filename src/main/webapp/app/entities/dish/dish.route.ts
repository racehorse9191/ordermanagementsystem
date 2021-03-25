import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { DishService } from './dish.service';
import { DishComponent } from './dish.component';
import { DishDetailComponent } from './dish-detail.component';
import { DishUpdateComponent } from './dish-update.component';
import { Dish, IDish } from '../../shared/model/dish.model';
import { Authority } from '../../shared/constants/authority.constants';
import { UserRouteAccessService } from '../../core/auth/user-route-access-service';

@Injectable({ providedIn: 'root' })
export class DishResolve implements Resolve<IDish> {
  constructor(private service: DishService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDish> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((dish: HttpResponse<Dish>) => {
          if (dish.body) {
            return of(dish.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Dish());
  }
}

export const dishRoute: Routes = [
  {
    path: '',
    component: DishComponent,
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DishDetailComponent,
    resolve: {
      dish: DishResolve,
    },
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DishUpdateComponent,
    resolve: {
      dish: DishResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DishUpdateComponent,
    resolve: {
      dish: DishResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
