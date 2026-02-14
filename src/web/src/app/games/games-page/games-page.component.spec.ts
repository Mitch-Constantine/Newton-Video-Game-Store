import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { GamesPageComponent } from './games-page.component';
import { GamesApiService } from '../../core/services/games-api.service';

describe('GamesPageComponent', () => {
  let httpMock: HttpTestingController;
  const routerMock = { navigate: () => {} };

  function flushInitialRequest(): void {
    const matches = httpMock.match((r) => r.url.includes('games') && r.method === 'GET');
    matches.forEach((r) => r.flush({ items: [], totalCount: 0 }));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesPageComponent, HttpClientTestingModule],
      providers: [
        GamesApiService,
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], totalCount: 0 }));
  });

  it('should build list API query with offset, limit, sort', () => {
    const fixture = TestBed.createComponent(GamesPageComponent);
    fixture.detectChanges();

    const matches = httpMock.match((r) => r.url.includes('games') && r.method === 'GET');
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const req = matches[0];
    expect(req.request.params.get('offset')).toBe('0');
    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('sortProp')).toBe('title');
    expect(req.request.params.get('sortDir')).toBe('asc');

    matches.forEach((r) => r.flush({ items: [], totalCount: 0 }));
    fixture.detectChanges();
  });

  it('should include q in API when search changes', () => {
    const fixture = TestBed.createComponent(GamesPageComponent);
    fixture.detectChanges();
    flushInitialRequest();

    fixture.componentInstance.searchQ.set('zelda');
    fixture.componentInstance.onSearchChange();

    const req = httpMock.expectOne((r) => r.url.includes('games') && r.method === 'GET');
    expect(req.request.params.get('q')).toBe('zelda');
    expect(req.request.params.get('offset')).toBe('0');
    req.flush({ items: [], totalCount: 0 });
  });

  it('should include platform and status in API when filters change', () => {
    const fixture = TestBed.createComponent(GamesPageComponent);
    fixture.detectChanges();
    flushInitialRequest();

    fixture.componentInstance.filterPlatform.set('PS5');
    fixture.componentInstance.filterStatus.set('Active');
    fixture.componentInstance.onFilterChange();

    const req = httpMock.expectOne((r) => r.url.includes('games') && r.method === 'GET');
    expect(req.request.params.get('platform')).toBe('PS5');
    expect(req.request.params.get('status')).toBe('Active');
    expect(req.request.params.get('offset')).toBe('0');
    req.flush({ items: [], totalCount: 0 });
  });

  it('should include offset from page when page event fires', () => {
    const fixture = TestBed.createComponent(GamesPageComponent);
    fixture.detectChanges();
    flushInitialRequest();

    fixture.componentInstance.onPage({ offset: 2 });
    const req = httpMock.expectOne((r) => r.url.includes('games') && r.method === 'GET');
    expect(req.request.params.get('offset')).toBe('20');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush({ items: [], totalCount: 0 });
  });

  it('should reset offset to 0 and include sort when sort event fires', () => {
    const fixture = TestBed.createComponent(GamesPageComponent);
    fixture.detectChanges();
    flushInitialRequest();

    fixture.componentInstance.onSort({ sorts: [{ prop: 'price', dir: 'desc' }] });
    const req = httpMock.expectOne((r) => r.url.includes('games') && r.method === 'GET');
    expect(req.request.params.get('sortProp')).toBe('price');
    expect(req.request.params.get('sortDir')).toBe('desc');
    expect(req.request.params.get('offset')).toBe('0');
    req.flush({ items: [], totalCount: 0 });
  });
});
