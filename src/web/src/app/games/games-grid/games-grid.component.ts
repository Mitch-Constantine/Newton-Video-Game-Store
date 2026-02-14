import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameListItemDto } from '../../models/game';

/** Column definition for the table */
interface Column {
  prop: string;
  label: string;
  width: number; // width in %
}

@Component({
  selector: 'app-games-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games-grid.component.html',
  styleUrl: './games-grid.component.css'
})
export class GamesGridComponent {
  @Input() rows: GameListItemDto[] = [];
  @Input() loading = false;
  @Input() pageOffset = 0;
  @Input() pageSize = 10;
  @Input() totalCount = 0;
  @Input() sortProp = 'title';
  @Input() sortDir: 'asc' | 'desc' = 'asc';

  @Output() page = new EventEmitter<{ offset: number }>();
  @Output() sort = new EventEmitter<{ sorts: { prop: string; dir: string }[] }>();
  @Output() edit = new EventEmitter<string>();

  readonly columns: Column[] = [
    { prop: 'title', label: 'Title', width: 28 },
    { prop: 'barcode', label: 'Barcode', width: 14 },
    { prop: 'platform', label: 'Platform', width: 12 },
    { prop: 'status', label: 'Status', width: 12 },
    { prop: 'price', label: 'Price', width: 10 },
    { prop: 'releaseDate', label: 'Release Date', width: 24 }
  ];

  get startItem(): number {
    const t = this.totalCount;
    if (t === 0) return 0;
    return this.pageOffset * this.pageSize + 1;
  }

  get endItem(): number {
    const t = this.totalCount;
    const end = (this.pageOffset + 1) * this.pageSize;
    return t === 0 ? 0 : Math.min(end, t);
  }

  get totalPages(): number {
    const size = this.pageSize || 1;
    return Math.max(1, Math.ceil(this.totalCount / size));
  }

  get currentPage(): number {
    return this.pageOffset + 1;
  }

  get canPrev(): boolean {
    return this.pageOffset > 0;
  }

  get canNext(): boolean {
    return (this.pageOffset + 1) * this.pageSize < this.totalCount;
  }

  sortHeader(prop: string): void {
    const dir = this.sortProp === prop && this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sort.emit({ sorts: [{ prop, dir }] });
  }

  sortIcon(prop: string): 'asc' | 'desc' | null {
    if (this.sortProp !== prop) return null;
    return this.sortDir;
  }

  prevPage(): void {
    if (this.canPrev) this.page.emit({ offset: this.pageOffset - 1 });
  }

  nextPage(): void {
    if (this.canNext) this.page.emit({ offset: this.pageOffset + 1 });
  }

  onRowClick(row: GameListItemDto): void {
    this.edit.emit(row.id);
  }
}
