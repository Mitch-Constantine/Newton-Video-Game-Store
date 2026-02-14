import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'games' },
  { path: 'games', loadComponent: () => import('./games/games-page/games-page.component').then(m => m.GamesPageComponent) },
  { path: 'games/new', loadComponent: () => import('./games/game-form-page/game-form-page.component').then(m => m.GameFormPageComponent) },
  { path: 'games/:id', loadComponent: () => import('./games/game-form-page/game-form-page.component').then(m => m.GameFormPageComponent) },
  { path: '**', redirectTo: 'games' }
];
