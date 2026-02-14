import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public toast: ToastService) {
    effect(() => {
      const msg = this.toast.messageToShow();
      if (msg) {
        const id = setTimeout(() => this.toast.clear(), 5000);
        return () => clearTimeout(id);
      }
      return undefined;
    });
  }
}
