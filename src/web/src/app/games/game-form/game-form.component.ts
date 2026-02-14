import { Component, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { GamesApiService } from '../../core/services/games-api.service';
import { DateProviderService } from '../../core/services/date-provider.service';
import { getErrorMessage } from '../../core/utils/http-error';
import { GameDetailDto, CreateGameDto, UpdateGameDto, PLATFORMS, STATUSES } from '../../models/game';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConcurrencyModalComponent } from '../concurrency-modal/concurrency-modal.component';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.css'
})
export class GameFormComponent implements OnInit {
  @Input() id: string | null = null;
  @Output() saved = new EventEmitter<GameDetailDto>();
  @Output() deleted = new EventEmitter<void>();

  form!: FormGroup;
  loading = signal(false);
  loadError = signal<string | null>(null);
  saveError = signal<string | null>(null);
  platforms = PLATFORMS;
  statuses = STATUSES;

  private currentGame = signal<GameDetailDto | null>(null);

  constructor(
    private fb: FormBuilder,
    private api: GamesApiService,
    private modal: NgbModal,
    private dateProvider: DateProviderService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.id) this.loadGame();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      barcode: ['', [Validators.required, Validators.maxLength(64)]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      platform: ['PC', Validators.required],
      releaseDate: [null as string | null],
      status: ['Upcoming', Validators.required],
      price: [1, [Validators.required, this.minPriceValidator]]
    });
    this.form.get('status')?.valueChanges.subscribe(() => this.updateReleaseDateValidator());
    this.updateReleaseDateValidator();
  }

  private updateReleaseDateValidator(): void {
    const status = this.form.get('status')?.value;
    const releaseDate = this.form.get('releaseDate');
    if (!releaseDate) return;
    const validators = [];
    if (status === 'Upcoming' || status === 'Active') validators.push(Validators.required);
    validators.push((ctrl: AbstractControl): ValidationErrors | null => this.statusReleaseDateError(status, ctrl.value));
    releaseDate.clearValidators();
    releaseDate.setValidators(validators);
    releaseDate.updateValueAndValidity();
  }

  /** Price must be strictly greater than 0. */
  private readonly minPriceValidator = (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') return null;
    const n = Number(v);
    if (Number.isNaN(n) || n <= 0) return { minPrice: 'Price must be greater than 0.' };
    return null;
  };

  private statusReleaseDateError(status: string, value: string | null): ValidationErrors | null {
    if (value == null || value === '') return null;
    const dateStr = String(value).substring(0, 10);
    const today = this.dateProvider.getUtcToday();
    if (status === 'Upcoming') {
      if (dateStr <= today) return { statusReleaseDate: 'When Status is Upcoming, ReleaseDate must be after the current date.' };
    } else if (status === 'Active') {
      if (dateStr > today) return { statusReleaseDate: 'When Status is Active, ReleaseDate must be on or before the current date.' };
    } else if (status === 'Discontinued') {
      if (dateStr > today) return { statusReleaseDate: 'When Status is Discontinued, ReleaseDate must not be in the future.' };
    }
    return null;
  }

  private loadGame(): void {
    if (!this.id) return;
    this.loading.set(true);
    this.loadError.set(null);
    this.api.getById(this.id).subscribe({
      next: (g) => {
        this.currentGame.set(g);
        this.form.patchValue({
          barcode: g.barcode,
          title: g.title,
          description: g.description,
          platform: g.platform,
          releaseDate: g.releaseDate ?? null,
          status: g.status,
          price: g.price
        });
        (this.form as unknown as { rowVersion?: string }).rowVersion = g.rowVersion;
        this.updateReleaseDateValidator();
        this.loading.set(false);
      },
      error: (err) => {
        this.loadError.set(getErrorMessage(err, 'Failed to load game'));
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    this.saveError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    const releaseDate = value.releaseDate ? String(value.releaseDate).substring(0, 10) : null;

    if (this.id) {
      const rowVersion = (this.form as unknown as { rowVersion?: string }).rowVersion;
      if (!rowVersion) {
        this.saveError.set('RowVersion missing. Reload the game.');
        return;
      }
      const dto: UpdateGameDto = { ...value, releaseDate, rowVersion };
      this.loading.set(true);
      this.api.update(this.id, dto).subscribe({
        next: (g) => {
          this.currentGame.set(g);
          (this.form as unknown as { rowVersion?: string }).rowVersion = g.rowVersion;
          this.saved.emit(g);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          if (err?.status === 409 && (err?.error as { errorCode?: string })?.errorCode === 'ConcurrencyConflict') {
            this.openConcurrencyModal();
          } else {
            this.saveError.set(getErrorMessage(err, 'Save failed'));
          }
        }
      });
    } else {
      const dto: CreateGameDto = { ...value, releaseDate };
      this.loading.set(true);
      this.api.create(dto).subscribe({
        next: (g) => { this.saved.emit(g); this.loading.set(false); },
        error: (err) => {
          this.saveError.set(getErrorMessage(err, 'Create failed'));
          this.loading.set(false);
        }
      });
    }
  }

  private openConcurrencyModal(): void {
    const ref = this.modal.open(ConcurrencyModalComponent, { backdrop: 'static', keyboard: false });
    ref.result.then(() => this.reloadLatest(), () => {});
  }

  reloadLatest(): void {
    if (!this.id) return;
    this.loadError.set(null);
    this.api.getById(this.id).subscribe({
      next: (g) => {
        this.currentGame.set(g);
        this.form.patchValue({
          barcode: g.barcode,
          title: g.title,
          description: g.description,
          platform: g.platform,
          releaseDate: g.releaseDate ?? null,
          status: g.status,
          price: g.price
        });
        (this.form as unknown as { rowVersion?: string }).rowVersion = g.rowVersion;
      },
      error: () => this.loadError.set('Failed to reload')
    });
  }

  deleteGame(): void {
    if (!this.id) return;
    const ref = this.modal.open(ConfirmDeleteModalComponent, { backdrop: 'static', keyboard: false });
    ref.result.then(
      (result) => {
        if (result === 'delete') this.performDelete();
      },
      () => {}
    );
  }

  private performDelete(): void {
    if (!this.id) return;
    this.api.delete(this.id).subscribe({
      next: () => this.deleted.emit(),
      error: (err) => {
        this.saveError.set(getErrorMessage(err, 'Delete failed'));
      }
    });
  }

  get isEditMode(): boolean {
    return this.id != null;
  }
}
