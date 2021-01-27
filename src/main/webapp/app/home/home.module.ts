import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrderManagementSystemSharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [OrderManagementSystemSharedModule, MatGridListModule, MatChipsModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
})
export class OrderManagementSystemHomeModule {}
