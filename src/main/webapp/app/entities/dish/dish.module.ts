import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DishComponent } from './dish.component';
import { DishDetailComponent } from './dish-detail.component';
import { DishUpdateComponent } from './dish-update.component';
import { DishDeleteDialogComponent } from './dish-delete-dialog.component';
import { dishRoute } from './dish.route';
import { OrderManagementSystemSharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [OrderManagementSystemSharedModule, RouterModule.forChild(dishRoute)],
  declarations: [DishComponent, DishDetailComponent, DishUpdateComponent, DishDeleteDialogComponent],
  entryComponents: [DishDeleteDialogComponent],
})
export class OrderManagementSystemDishModule {}
