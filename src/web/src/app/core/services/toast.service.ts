import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly message = signal<string | null>(null);

  readonly messageToShow = computed(() => this.message());

  show(msg: string): void {
    this.message.set(msg);
  }

  clear(): void {
    this.message.set(null);
  }
}
