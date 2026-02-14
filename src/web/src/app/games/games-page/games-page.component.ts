import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesApiService } from '../../core/services/games-api.service';
import { getErrorMessage } from '../../core/utils/http-error';
import { GameListItemDto, GamesListResponse } from '../../models/game';
import { GamesGridComponent } from '../games-grid/games-grid.component';
import { PLATFORMS, STATUSES } from '../../models/game';

@Component({
  selector: 'app-games-page',
  standalone: true,
  imports: [CommonModule, FormsModule, GamesGridComponent],
  templateUrl: './games-page.component.html',
  styleUrl: './games-page.component.css'
})
export class GamesPageComponent implements OnInit {
  items = signal<GameListItemDto[]>([]);
  totalCount = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);

  pageOffset = signal(0);
  pageSize = signal(10);
  sortProp = signal<string>('title');
  sortDir = signal<'asc' | 'desc'>('asc');
  searchQ = signal('');
  filterPlatform = signal<string>('');
  filterStatus = signal<string>('');

  platforms = PLATFORMS;
  statuses = STATUSES;

  constructor(
    private api: GamesApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    const offset = this.pageOffset() * this.pageSize();
    this.api.getList({
      offset,
      limit: this.pageSize(),
      sortProp: this.sortProp() || undefined,
      sortDir: this.sortDir() || undefined,
      q: this.searchQ() || undefined,
      platform: this.filterPlatform() || undefined,
      status: this.filterStatus() || undefined
    }).subscribe({
      next: (res: GamesListResponse) => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getErrorMessage(err, 'Failed to load games'));
        this.loading.set(false);
      }
    });
  }

  onPage(event: { offset: number }): void {
    this.pageOffset.set(event.offset);
    this.load();
  }

  onSort(event: { sorts: { prop: string; dir: string }[] }): void {
    const s = event.sorts?.[0];
    if (s) {
      this.sortProp.set(s.prop);
      this.sortDir.set((s.dir === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc');
      this.pageOffset.set(0);
      this.load();
    }
  }

  onSearchChange(): void {
    this.pageOffset.set(0);
    this.load();
  }

  onFilterChange(): void {
    this.pageOffset.set(0);
    this.load();
  }

  goToNew(): void {
    this.router.navigate(['/games/new']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/games', id]);
  }
}
