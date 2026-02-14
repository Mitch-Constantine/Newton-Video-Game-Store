import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-concurrency-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">This game was changed elsewhere</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="cancel()"></button>
    </div>
    <div class="modal-body">
      <p>Another change was saved for this game. Reload the latest version to avoid overwriting it.</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="reload()">Reload latest</button>
    </div>
  `
})
export class ConcurrencyModalComponent {
  constructor(public modal: NgbActiveModal) {}

  reload(): void {
    this.modal.close('reload');
  }

  cancel(): void {
    this.modal.dismiss();
  }
}
