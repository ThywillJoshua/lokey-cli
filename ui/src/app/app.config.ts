import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { CustomLocationStrategy } from './shared/services/custom-routing/custom-location-strategy/custom-location-strategy.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { env } from '../environments/environment';
import { activeHttpCountInterceptor } from './shared/interceptors/active-http-count.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withFetch(),
      withInterceptors([activeHttpCountInterceptor])
    ),
    provideRouter(routes),
    {
      provide: LocationStrategy,
      useClass: env.isEmbedded ? CustomLocationStrategy : PathLocationStrategy,
    },
    provideClientHydration(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
