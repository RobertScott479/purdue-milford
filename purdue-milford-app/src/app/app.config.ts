import { ApplicationConfig, ENVIRONMENT_INITIALIZER, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes, SaveFormsGuard } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { CancelHttpInterceptor } from './cancelHttp.interceptor';
import { iconService } from './icon.service';
import { HomeService } from './home.service';

export const appConfig: ApplicationConfig = {
  providers: [
    SaveFormsGuard,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: CancelHttpInterceptor, multi: true },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => {
        const icons = inject(iconService);
        icons.registerIcons();
      },
      multi: true,
    },
  ],
};
