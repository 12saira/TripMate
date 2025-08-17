import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    BrowserAnimationsModule,
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes)]
};
