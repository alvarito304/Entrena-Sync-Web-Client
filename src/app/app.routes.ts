import { Routes } from '@angular/router';

import {HomeComponent} from './features/home/pages/home/home.component';
import {HumanBodyPageComponent} from './features/human-body/pages/human-body-page/human-body-page.component';
import {KeycloakComponent} from './features/keycloak/keycloak.component';
import {SignInComponent} from './features/keycloak/sing-in/sign-in.component';
import {AuthGuard} from './features/keycloak/services/AuthGuard';
import {
  ExercisesControllPanelComponent
} from './features/exercises/pages/exercises-controll-panel/exercises-controll-panel.component';
import {AdminPanelComponent} from './features/admin-bo/admin-panel/admin-panel.component';
import {RoleGuard} from './features/keycloak/services/RoleGuard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: HomeComponent },
  { path: 'login', component: KeycloakComponent},
  { path: 'register', component: SignInComponent},
  { path: 'human-body', component: HumanBodyPageComponent},
  { path: 'adminpanel', component: AdminPanelComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'exercises', component: ExercisesControllPanelComponent}
];
