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

@NgModule({
  declarations: [MenuComponent, OrderDetailsComponent, DishViewComponent, DishCategoryComponent],
  imports: [CommonModule, OrderManagementSystemSharedModule, NgbModule, RouterModule.forChild(UiComponentRoutes)],
  exports: [MenuComponent, OrderDetailsComponent, DishViewComponent, DishCategoryComponent],
  providers: [SubscriptionService],
})
export class UicomponentsModule {}
