import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDish } from 'app/shared/model/dish.model';
import { DishService } from './dish.service';

@Component({
  templateUrl: './dish-delete-dialog.component.html',
})
export class DishDeleteDialogComponent {
  dish?: IDish;

  constructor(protected dishService: DishService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dishService.delete(id).subscribe(() => {
      this.eventManager.broadcast('dishListModification');
      this.activeModal.close();
    });
  }
}
