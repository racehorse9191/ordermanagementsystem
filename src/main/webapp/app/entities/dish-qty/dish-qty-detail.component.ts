import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDishQty } from 'app/shared/model/dish-qty.model';

@Component({
  selector: 'jhi-dish-qty-detail',
  templateUrl: './dish-qty-detail.component.html',
})
export class DishQtyDetailComponent implements OnInit {
  dishQty: IDishQty | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dishQty }) => (this.dishQty = dishQty));
  }

  previousState(): void {
    window.history.back();
  }
}
