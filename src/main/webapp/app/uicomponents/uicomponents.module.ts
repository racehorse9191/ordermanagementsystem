import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DishViewComponent } from './dish-view/dish-view.component';

@NgModule({
  declarations: [MenuComponent, OrderDetailsComponent, DishViewComponent],
  imports: [CommonModule],
})
export class UicomponentsModule {}
