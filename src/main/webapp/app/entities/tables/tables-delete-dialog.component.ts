import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITables } from 'app/shared/model/tables.model';
import { TablesService } from './tables.service';

@Component({
  templateUrl: './tables-delete-dialog.component.html',
})
export class TablesDeleteDialogComponent {
  tables?: ITables;

  constructor(protected tablesService: TablesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tablesService.delete(id).subscribe(() => {
      this.eventManager.broadcast('tablesListModification');
      this.activeModal.close();
    });
  }
}
