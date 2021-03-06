import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuComponent } from './menu.component';
import { MenuDetailComponent } from './menu-detail.component';
import { MenuUpdateComponent } from './menu-update.component';
import { MenuDeleteDialogComponent } from './menu-delete-dialog.component';
import { menuRoute } from './menu.route';
import { OrderManagementSystemSharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [OrderManagementSystemSharedModule, RouterModule.forChild(menuRoute)],
  declarations: [MenuComponent, MenuDetailComponent, MenuUpdateComponent, MenuDeleteDialogComponent],
  entryComponents: [MenuDeleteDialogComponent],
})
export class OrderManagementSystemMenuModule {}
