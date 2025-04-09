import { Routes } from '@angular/router';

import {HomeComponent} from './features/home/pages/home/home.component';
import {AppComponent} from './app.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'theme-demo', loadComponent: () => import('./theme-demo/theme-demo.component').then(m => m.ThemeDemoComponent) }
];
