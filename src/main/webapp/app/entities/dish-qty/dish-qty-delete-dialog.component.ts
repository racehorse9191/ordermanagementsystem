import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDishQty } from 'app/shared/model/dish-qty.model';
import { DishQtyService } from './dish-qty.service';

@Component({
  templateUrl: './dish-qty-delete-dialog.component.html',
})
export class DishQtyDeleteDialogComponent {
  dishQty?: IDishQty;

  constructor(protected dishQtyService: DishQtyService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dishQtyService.delete(id).subscribe(() => {
      this.eventManager.broadcast('dishQtyListModification');
      this.activeModal.close();
    });
  }
}
