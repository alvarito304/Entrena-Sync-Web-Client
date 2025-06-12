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
import {UserAdministrationComponent} from './features/admin-bo/user-administration/user-administration.component';
import {WorkoutPageComponent} from './features/workouts/pages/workout-page/workout-page.component';
import {EditProfileComponent} from './features/edit-profile/edit-profile.component';
import {WorkerAdministrationComponent} from './features/admin-bo/worker-administration/worker-administration.component';
import {WorkerPageComponent} from './features/worker-page/worker-page.component';
import {ServicesPageComponent} from './features/services-page/services-page.component';
import {PaymentSuccessComponent} from './features/services-page/payment-success/payment-success.component';
import {MyHireServicesComponent} from './features/services-page/my-hire-services/my-hire-services.component';
import {WorkerPanelComponent} from './features/worker-bo/worker-panel/worker-panel.component';
import {
  WorkerClientAdministrationComponent
} from './features/worker-bo/worker-client-administration/worker-client-administration.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: HomeComponent },
  { path: 'login', component: KeycloakComponent},
  { path: 'register', component: SignInComponent},
  { path: 'human-body', component: HumanBodyPageComponent},
  { path: 'workouts', component: WorkoutPageComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'Client'] } },
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'Client'] } },
  { path: 'my-services', component: MyHireServicesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'Client'] }},
  { path: 'trainers', component: WorkerPageComponent},
  { path: 'services/:id', component: ServicesPageComponent },
  { path: 'payment-success', component: PaymentSuccessComponent},
  { path: 'adminpanel', component: AdminPanelComponent,
    canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] }, children: [
      { path: '', redirectTo: 'user-administration', pathMatch: 'full' },
      { path: 'user-administration', component: UserAdministrationComponent },
      { path: 'exercises', component: ExercisesControllPanelComponent},
      { path: 'worker-administration', component: WorkerAdministrationComponent }
    ]},
  {
    path: 'worker-panel', component: WorkerPanelComponent, canActivate: [AuthGuard, RoleGuard],    data: { roles: ['Worker'] },
    children: [
      { path: '', redirectTo: 'my-clients', pathMatch: 'full' },
      { path: 'my-clients', component: WorkerClientAdministrationComponent }
    ]
  }

];
