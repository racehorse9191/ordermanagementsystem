import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrderManagementSystemSharedModule } from 'app/shared/shared.module';
import { DishQtyComponent } from './dish-qty.component';
import { DishQtyDetailComponent } from './dish-qty-detail.component';
import { DishQtyUpdateComponent } from './dish-qty-update.component';
import { DishQtyDeleteDialogComponent } from './dish-qty-delete-dialog.component';
import { dishQtyRoute } from './dish-qty.route';

@NgModule({
  imports: [OrderManagementSystemSharedModule, RouterModule.forChild(dishQtyRoute)],
  declarations: [DishQtyComponent, DishQtyDetailComponent, DishQtyUpdateComponent, DishQtyDeleteDialogComponent],
  entryComponents: [DishQtyDeleteDialogComponent],
})
export class OrderManagementSystemDishQtyModule {}
