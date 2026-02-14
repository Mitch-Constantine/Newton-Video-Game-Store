import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GameListItemDto,
  GamesListResponse,
  GameDetailDto,
  CreateGameDto,
  UpdateGameDto
} from '../../models/game';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class GamesApiService {
  constructor(private http: HttpClient) {}

  getList(params: {
    offset: number;
    limit: number;
    sortProp?: string;
    sortDir?: string;
    q?: string;
    platform?: string;
    status?: string;
  }): Observable<GamesListResponse> {
    let httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString());
    if (params.sortProp) httpParams = httpParams.set('sortProp', params.sortProp);
    if (params.sortDir) httpParams = httpParams.set('sortDir', params.sortDir);
    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.platform) httpParams = httpParams.set('platform', params.platform);
    if (params.status) httpParams = httpParams.set('status', params.status);

    return this.http.get<GamesListResponse>(`${API}/games`, { params: httpParams });
  }

  getById(id: string): Observable<GameDetailDto> {
    return this.http.get<GameDetailDto>(`${API}/games/${id}`);
  }

  create(dto: CreateGameDto): Observable<GameDetailDto> {
    return this.http.post<GameDetailDto>(`${API}/games`, dto);
  }

  update(id: string, dto: UpdateGameDto): Observable<GameDetailDto> {
    return this.http.put<GameDetailDto>(`${API}/games/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/games/${id}`);
  }
}
