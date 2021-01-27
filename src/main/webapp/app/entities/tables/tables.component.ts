import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITables } from 'app/shared/model/tables.model';
import { TablesService } from './tables.service';
import { TablesDeleteDialogComponent } from './tables-delete-dialog.component';

@Component({
  selector: 'jhi-tables',
  templateUrl: './tables.component.html',
})
export class TablesComponent implements OnInit, OnDestroy {
  tables?: ITables[];
  eventSubscriber?: Subscription;

  constructor(protected tablesService: TablesService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.tablesService.query().subscribe((res: HttpResponse<ITables[]>) => (this.tables = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInTables();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ITables): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInTables(): void {
    this.eventSubscriber = this.eventManager.subscribe('tablesListModification', () => this.loadAll());
  }

  delete(tables: ITables): void {
    const modalRef = this.modalService.open(TablesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tables = tables;
  }
}
