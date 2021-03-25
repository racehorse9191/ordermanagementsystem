import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDishQty } from './../../shared/model/dish-qty.model';
import { DishQtyService } from './dish-qty.service';
import { DishQtyDeleteDialogComponent } from './dish-qty-delete-dialog.component';

@Component({
  selector: 'jhi-dish-qty',
  templateUrl: './dish-qty.component.html',
})
export class DishQtyComponent implements OnInit, OnDestroy {
  dishQties?: IDishQty[];
  eventSubscriber?: Subscription;

  constructor(protected dishQtyService: DishQtyService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.dishQtyService.query().subscribe((res: HttpResponse<IDishQty[]>) => (this.dishQties = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInDishQties();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IDishQty): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInDishQties(): void {
    this.eventSubscriber = this.eventManager.subscribe('dishQtyListModification', () => this.loadAll());
  }

  delete(dishQty: IDishQty): void {
    const modalRef = this.modalService.open(DishQtyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.dishQty = dishQty;
  }
}
