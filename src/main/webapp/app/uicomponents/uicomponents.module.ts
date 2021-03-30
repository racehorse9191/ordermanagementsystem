import { ToastService } from './../shared/util/toast.service';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { SelectTableComponent } from './select-table/select-table.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { ShefOrderlist } from './shef-orderlist/shef-orderlist.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MyOrderlist } from './my-orders/my-orders.component';
import { ModalComponent } from './modal/modal.component';
import { NgxPrintModule } from 'ngx-print';
import { ToastComponent } from './toast/toast.component';
import { QRMenuComponent } from './qr-menu/menu/qrmenu.component';
@NgModule({
  declarations: [
    MenuComponent,
    OrderDetailsComponent,
    DishViewComponent,
    DishCategoryComponent,
    SelectTableComponent,
    ShefOrderlist,
    MyOrderlist,
    ModalComponent,
    ToastComponent,
    QRMenuComponent,
  ],
  imports: [
    CommonModule,
    OrderManagementSystemSharedModule,
    NgbModule,
    MatButtonModule,
    MatGridListModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    NgbModalModule,
    RouterModule.forChild(UiComponentRoutes),
    NgxPrintModule,
  ],
  exports: [
    MenuComponent,
    SelectTableComponent,
    OrderDetailsComponent,
    DishViewComponent,
    DishCategoryComponent,
    ShefOrderlist,
    MyOrderlist,
    QRMenuComponent,
  ],
  providers: [SubscriptionService, ToastService],
})
export class UicomponentsModule {}
