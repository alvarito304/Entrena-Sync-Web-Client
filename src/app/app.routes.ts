import { Routes } from '@angular/router';

import {HomeComponent} from './features/home/pages/home/home.component';
import {HumanBodyPageComponent} from './features/human-body/pages/human-body-page/human-body-page.component';
import {KeycloakComponent} from './features/keycloak/keycloak.component';
import {SignInComponent} from './features/keycloak/sing-in/sign-in.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: HomeComponent },
  { path: 'login', component: KeycloakComponent},
  { path: 'register', component: SignInComponent},
  { path: 'human-body', component: HumanBodyPageComponent },
];
