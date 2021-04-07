import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderDetailComponent } from './order-detail.component';
import { OrderUpdateComponent } from './order-update.component';
import { OrderDeleteDialogComponent } from './order-delete-dialog.component';
import { orderRoute } from './order.route';
import { OrderManagementSystemSharedModule } from '../../shared/shared.module';
import { MyOrdersComponent } from './my-orders.component';

@NgModule({
  imports: [OrderManagementSystemSharedModule, RouterModule.forChild(orderRoute)],
  declarations: [OrderComponent, OrderDetailComponent, OrderUpdateComponent, OrderDeleteDialogComponent, MyOrdersComponent],
  entryComponents: [OrderDeleteDialogComponent],
})
export class OrderManagementSystemOrderModule {}
