import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TablesComponent } from './tables.component';
import { TablesDetailComponent } from './tables-detail.component';
import { TablesUpdateComponent } from './tables-update.component';
import { TablesDeleteDialogComponent } from './tables-delete-dialog.component';
import { tablesRoute } from './tables.route';
import { OrderManagementSystemSharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [OrderManagementSystemSharedModule, RouterModule.forChild(tablesRoute)],
  declarations: [TablesComponent, TablesDetailComponent, TablesUpdateComponent, TablesDeleteDialogComponent],
  entryComponents: [TablesDeleteDialogComponent],
})
export class OrderManagementSystemTablesModule {}
