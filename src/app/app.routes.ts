import { Routes } from '@angular/router';

import {HomeComponent} from './features/home/pages/home/home.component';
import {KeycloakComponent} from './features/keycloak/keycloak.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: HomeComponent },
  { path: 'login', component: KeycloakComponent}
];
