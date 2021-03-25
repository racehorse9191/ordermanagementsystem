import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMenu } from '../../shared/model/menu.model';

@Component({
  selector: 'jhi-menu-detail',
  templateUrl: './menu-detail.component.html',
})
export class MenuDetailComponent implements OnInit {
  menu: IMenu | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ menu }) => {
      console.log('menu=>', menu);
      this.menu = menu;
      const tempQty = {};
      Object.keys(this.menu?.dishQty || []).forEach(key => {
        if (menu?.dishQty) {
          tempQty[key] = menu?.dishQty[key];
        }
      });
      this.menu.dishQty = [...[tempQty]];
    });
  }

  previousState(): void {
    window.history.back();
  }
}
