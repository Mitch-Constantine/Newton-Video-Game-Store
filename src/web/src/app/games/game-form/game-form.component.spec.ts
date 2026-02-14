import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameFormComponent } from './game-form.component';
import { GamesApiService } from '../../core/services/games-api.service';
import { DateProviderService } from '../../core/services/date-provider.service';

describe('GameFormComponent', () => {
  const utcToday = '2025-06-15';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameFormComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        GamesApiService,
        { provide: DateProviderService, useValue: { getUtcToday: () => utcToday } },
        { provide: NgbModal, useValue: { open: () => ({ result: Promise.resolve() }) } }
      ]
    }).compileComponents();
  });

  it('should require release date when Status is Upcoming', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Upcoming', releaseDate: null });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('required')).toBe(true);
  });

  it('should require release date when Status is Active', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Active', releaseDate: null });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('required')).toBe(true);
  });

  it('should not require release date when Status is Discontinued', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Discontinued', releaseDate: null });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('required')).toBe(false);
  });

  it('should invalidate Upcoming when release date is on or before today (UTC)', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Upcoming', releaseDate: '2025-06-15' });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('statusReleaseDate')).toBe(true);
    form.patchValue({ releaseDate: '2025-06-14' });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('statusReleaseDate')).toBe(true);
  });

  it('should validate Upcoming when release date is after today (UTC)', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Upcoming', releaseDate: '2025-06-16' });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('statusReleaseDate')).toBe(false);
  });

  it('should invalidate Active when release date is after today (UTC)', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Active', releaseDate: '2025-06-16' });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('statusReleaseDate')).toBe(true);
  });

  it('should validate Active when release date is on or before today (UTC)', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Active', releaseDate: '2025-06-15' });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('statusReleaseDate')).toBe(false);
    form.patchValue({ releaseDate: '2025-06-14' });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('statusReleaseDate')).toBe(false);
  });

  it('should invalidate Discontinued when release date is in the future', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Discontinued', releaseDate: '2025-06-16' });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('statusReleaseDate')).toBe(true);
  });

  it('should validate Discontinued when release date is null or in the past', () => {
    const fixture = TestBed.createComponent(GameFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'Discontinued', releaseDate: null });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.valid).toBe(true);
    form.patchValue({ releaseDate: '2025-06-14' });
    form.get('releaseDate')?.updateValueAndValidity();
    expect(form.get('releaseDate')?.hasError('statusReleaseDate')).toBe(false);
  });
});
