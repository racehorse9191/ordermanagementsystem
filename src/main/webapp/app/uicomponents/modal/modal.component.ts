import { Component, EventEmitter, Injectable, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from '../../shared/model/modal-config.model';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
@Injectable()
export class ModalComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  modalSettings: NgbModalOptions = {};
  @Output() dismissClicked = new EventEmitter<any>();
  @Output() closeClicked = new EventEmitter<any>();
  @Output() emptyTableclicked = new EventEmitter<any>();
  @Output() printBtnClick = new EventEmitter<any>();
  @Output() backBtnClick = new EventEmitter<any>();

  @ViewChild('modal') private modalContent: TemplateRef<ModalComponent>;
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      console.log('settings=>', this.modalSettings);
      this.modalRef = this.modalService.open(this.modalContent, {
        size: 'lg',
        scrollable: true,
        beforeDismiss: () => (this.modalSettings.backdrop == 'static' ? false : true),
      });
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async close(): Promise<void> {
    if (this.modalConfig.shouldClose === undefined || (await this.modalConfig.shouldClose())) {
      const result = this.modalConfig.onClose === undefined || (await this.modalConfig.onClose());
      this.closeClicked.emit(true);
      this.modalRef.close(result);
    }
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.shouldDismiss === undefined || (await this.modalConfig.shouldDismiss())) {
      const result = this.modalConfig.onDismiss === undefined || (await this.modalConfig.onDismiss());
      this.dismissClicked.emit(true);
      this.modalRef.dismiss(result);
    }
  }

  onEmptyTableclicked() {
    this.emptyTableclicked.emit();
  }

  onclickBackButton() {
    this.backBtnClick.emit();
    this.modalRef.close('back clicked');
  }

  onPrintBtnClick() {
    this.printBtnClick.emit();
  }
}
