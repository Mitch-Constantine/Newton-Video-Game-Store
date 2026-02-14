import { Injectable } from '@angular/core';

/**
 * Provides the current UTC date (YYYY-MM-DD) for validation (e.g. Status ↔ ReleaseDate).
 * Can be overridden in tests with a fixed date.
 */
@Injectable({ providedIn: 'root' })
export class DateProviderService {
  getUtcToday(): string {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
