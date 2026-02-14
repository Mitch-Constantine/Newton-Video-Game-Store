import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Delete game</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="cancel()"></button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete this game? This cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
      <button type="button" class="btn btn-danger" (click)="confirm()">Delete</button>
    </div>
  `
})
export class ConfirmDeleteModalComponent {
  constructor(public modal: NgbActiveModal) {}

  confirm(): void {
    this.modal.close('delete');
  }

  cancel(): void {
    this.modal.dismiss();
  }
}
