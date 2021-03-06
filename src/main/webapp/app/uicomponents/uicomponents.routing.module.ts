import { Authority } from '../shared/constants/authority.constants';
import { UserRouteAccessService } from '../core/auth/user-route-access-service';
import { DishViewComponent } from './dish-view/dish-view.component';
import { MenuComponent } from './menu/menu.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { Routes } from '@angular/router';
import { DishCategoryComponent } from './dish-category/dish-category.component';
import { SelectTableComponent } from './select-table/select-table.component';
import { ShefOrderlist } from './shef-orderlist/shef-orderlist.component';
import { MyOrderlist } from './my-orders/my-orders.component';

export const UiComponentRoutes: Routes = [
  {
    path: 'menu',
    component: MenuComponent,
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'ui/dishView',
    component: DishViewComponent,
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'ui/orderDetails',
    component: OrderDetailsComponent,
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'ui/dishCategory',
    component: DishCategoryComponent,
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'selectTable',
    component: SelectTableComponent,
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'cheforderlist',
    component: ShefOrderlist,
    data: {
      authorities: [Authority.CHEF, Authority.ADMIN, Authority.BARTENDER],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'myorderList/:status',
    component: MyOrderlist,
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'orderManagementSystemApp.dish.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
