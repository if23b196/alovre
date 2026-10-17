import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'upload',
    loadComponent: () => import('./features/upload/upload').then((m) => m.Upload),
  },
  {
    path: 'library',
    loadComponent: () => import('./features/library/library').then((m) => m.Library),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
