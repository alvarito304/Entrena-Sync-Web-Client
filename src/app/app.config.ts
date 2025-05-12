import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {providePrimeNG} from 'primeng/config';
import  Aura  from '@primeng/themes/aura';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import mypreset from './mypreset';
import {TokenInterceptor} from './features/keycloak/services/TokenInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    TokenInterceptor,
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),
    providePrimeNG({ theme: {
      preset: mypreset,
      options: {
          darkModeSelector: '.my-app-dark',
        cssLayer: {
          name: 'primeng',
          order: 'theme, base, primeng, tailwind-base , tailwind-utilities'
        }
      }
    }}),
    provideAnimations()
  ]
};
