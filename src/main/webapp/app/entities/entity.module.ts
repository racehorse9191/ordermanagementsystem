import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.OrderManagementSystemTablesModule),
      },
      {
        path: 'dish-qty',
        loadChildren: () => import('./dish-qty/dish-qty.module').then(m => m.OrderManagementSystemDishQtyModule),
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.OrderManagementSystemCategoryModule),
      },
      {
        path: 'dish',
        loadChildren: () => import('./dish/dish.module').then(m => m.OrderManagementSystemDishModule),
      },
      {
        path: 'menu',
        loadChildren: () => import('./menu/menu.module').then(m => m.OrderManagementSystemMenuModule),
      },
      {
        path: 'order',
        loadChildren: () => import('./order/order.module').then(m => m.OrderManagementSystemOrderModule),
      },
      {
        path: 'ui',
        loadChildren: () => import('./../uicomponents/uicomponents.module').then(m => m.UicomponentsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class OrderManagementSystemEntityModule {}
