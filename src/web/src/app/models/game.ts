export interface GameListItemDto {
  id: string;
  barcode: string;
  title: string;
  description: string;
  platform: string;
  releaseDate: string | null;
  status: string;
  price: number;
}

export interface GamesListResponse {
  items: GameListItemDto[];
  totalCount: number;
}

export interface GameDetailDto {
  id: string;
  barcode: string;
  title: string;
  description: string;
  platform: string;
  releaseDate: string | null;
  status: string;
  price: number;
  /** Base64 from API; send back as-is on update */
  rowVersion: string;
}

export interface CreateGameDto {
  barcode: string;
  title: string;
  description: string;
  platform: string;
  releaseDate: string | null;
  status: string;
  price: number;
}

export interface UpdateGameDto extends CreateGameDto {
  rowVersion: string;
}

export const PLATFORMS = ['PC', 'PS5', 'PS4', 'XBOX_SERIES', 'XBOX_ONE', 'SWITCH'] as const;
export const STATUSES = ['Upcoming', 'Active', 'Discontinued'] as const;
