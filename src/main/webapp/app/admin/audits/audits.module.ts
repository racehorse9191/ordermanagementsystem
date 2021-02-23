import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderManagementSystemSharedModule } from '../../shared/shared.module';

import { AuditsComponent } from './audits.component';

import { auditsRoute } from './audits.route';

@NgModule({
  imports: [OrderManagementSystemSharedModule, RouterModule.forChild([auditsRoute])],
  declarations: [AuditsComponent],
})
export class AuditsModule {}
