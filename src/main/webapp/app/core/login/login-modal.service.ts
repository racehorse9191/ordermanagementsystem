import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../shared/login/login.component';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginModalService {
  private isOpen = false;

  constructor(private modalService: NgbModal, private router: Router) {}

  open(): void {
    this.router.navigate(['']);
    /*  if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    const modalRef: NgbModalRef = this.modalService.open(LoginModalComponent);
    modalRef.result.finally(() => (this.isOpen = false));*/
  }
}
