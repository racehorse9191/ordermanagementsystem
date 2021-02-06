import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { OrderManagementSystemSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [OrderManagementSystemSharedModule, MatGridListModule, MatChipsModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
})
export class OrderManagementSystemHomeModule {}
