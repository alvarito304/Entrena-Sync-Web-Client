import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import {provideClientHydration, withEventReplay, withHttpTransferCacheOptions} from '@angular/platform-browser';
import {providePrimeNG} from 'primeng/config';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch} from '@angular/common/http';
import mypreset from './mypreset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch()),
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
    provideAnimations(),
  provideClientHydration(
    withHttpTransferCacheOptions({
      includeHeaders: ['link'],      // <-- aquí
      includePostRequests: false,    // opcional
      filter: req => true            // opcional: decidir qué peticiones cachear
    })
  )
  ]
};
