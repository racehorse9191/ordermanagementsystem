import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DishService } from './dish.service';
import { DishDeleteDialogComponent } from './dish-delete-dialog.component';
import { IDish } from '../../shared/model/dish.model';

@Component({
  selector: 'jhi-dish',
  templateUrl: './dish.component.html',
})
export class DishComponent implements OnInit, OnDestroy {
  dishes?: IDish[];
  eventSubscriber?: Subscription;

  constructor(
    protected dishService: DishService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.dishService.query().subscribe((res: HttpResponse<IDish[]>) => (this.dishes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInDishes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IDish): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInDishes(): void {
    this.eventSubscriber = this.eventManager.subscribe('dishListModification', () => this.loadAll());
  }

  delete(dish: IDish): void {
    const modalRef = this.modalService.open(DishDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.dish = dish;
  }
}
