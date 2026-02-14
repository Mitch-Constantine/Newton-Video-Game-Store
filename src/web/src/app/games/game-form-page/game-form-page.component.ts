import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameFormComponent } from '../game-form/game-form.component';
import { GameDetailDto } from '../../models/game';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-game-form-page',
  standalone: true,
  imports: [CommonModule, RouterModule, GameFormComponent],
  template: `
    <div class="container-fluid py-3">
      <a routerLink="/games" class="btn btn-link mb-2">Back to list</a>
      <app-game-form
        [id]="gameId()"
        (saved)="onSaved($event)"
        (deleted)="onDeleted()"
      />
    </div>
  `
})
export class GameFormPageComponent implements OnInit {
  gameId = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.gameId.set(id === 'new' ? null : id);
  }

  onSaved(_g: GameDetailDto): void {
    this.toast.show(this.gameId() === null ? 'Game created successfully.' : 'Game updated successfully.');
    this.router.navigate(['/games']);
  }

  onDeleted(): void {
    this.toast.show('Game deleted successfully.');
    this.router.navigate(['/games']);
  }
}
