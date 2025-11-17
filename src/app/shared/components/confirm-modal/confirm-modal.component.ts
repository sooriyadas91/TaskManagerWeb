import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  message: string = 'Are you sure?';
  onConfirm!: () => void;

  constructor(public bsModalRef: BsModalRef) {}

  confirm() {
    if (this.onConfirm) this.onConfirm();
    this.bsModalRef.hide();
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
