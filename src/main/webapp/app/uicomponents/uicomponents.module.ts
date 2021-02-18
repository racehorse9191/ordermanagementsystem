import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DishViewComponent } from './dish-view/dish-view.component';
import { OrderManagementSystemSharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { UiComponentRoutes } from './uicomponents.routing.module';
import { DishCategoryComponent } from './dish-category/dish-category.component';
import { SubscriptionService } from '../shared/subscription.service';
import { SelectTableComponent } from './select-table/select-table.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { ShefOrderlist } from './shef-orderlist/shef-orderlist.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [MenuComponent, OrderDetailsComponent, DishViewComponent, DishCategoryComponent, SelectTableComponent, ShefOrderlist],
  imports: [
    CommonModule,
    OrderManagementSystemSharedModule,
    NgbModule,
    MatGridListModule,
    MatChipsModule,
    MatRadioModule,
    MatCardModule,
    RouterModule.forChild(UiComponentRoutes),
  ],
  exports: [MenuComponent, SelectTableComponent, OrderDetailsComponent, DishViewComponent, DishCategoryComponent, ShefOrderlist],
  providers: [SubscriptionService],
})
export class UicomponentsModule {}
