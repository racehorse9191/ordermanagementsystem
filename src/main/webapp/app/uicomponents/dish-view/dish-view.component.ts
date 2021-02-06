import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IDish } from '../../shared/model/dish.model';

@Component({
  selector: 'jhi-dish-view',
  templateUrl: './dish-view.component.html',
  styleUrls: ['./dish-view.component.scss'],
})
export class DishViewComponent implements OnInit, OnChanges {
  @Input() dishes?: IDish[] = [];
  orders: any[] = [];
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.dishes?.forEach(x => this.orders.push(0));
  }

  ngOnInit(): void {}
  onOrderClicked(i: number) {
    this.orders[i] = this.orders[i] + 1;
  }
  orderButtonClicked(dish: any, orderQty: any) {
    console.log('order data=>', dish, orderQty);
  }
}
