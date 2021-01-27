import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrderManagementSystemSharedModule } from 'app/shared/shared.module';
import { TablesComponent } from './tables.component';
import { TablesDetailComponent } from './tables-detail.component';
import { TablesUpdateComponent } from './tables-update.component';
import { TablesDeleteDialogComponent } from './tables-delete-dialog.component';
import { tablesRoute } from './tables.route';

@NgModule({
  imports: [OrderManagementSystemSharedModule, RouterModule.forChild(tablesRoute)],
  declarations: [TablesComponent, TablesDetailComponent, TablesUpdateComponent, TablesDeleteDialogComponent],
  entryComponents: [TablesDeleteDialogComponent],
})
export class OrderManagementSystemTablesModule {}
