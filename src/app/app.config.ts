import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withPreloading,
  withRouterConfig
} from '@angular/router';
import { NgHttpLoaderModule, pendingRequestsInterceptor$ } from 'ng-http-loader';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage } from 'ngx-webstorage';
import { ToastrService, provideToastr } from 'ngx-toastr';
import { authInterceptor } from './auth/auth.interceptor';
import { loggingInterceptor } from './_helpers/logging.interceptor';
import { AuthGuardService } from './authentication/services/auth-guard.service';
import { AuthService } from './authentication/services/auth.service';
import { StorageService } from './_services/storage.service';
import { ServerErrorsInterceptor } from './_helpers/server_error/server-errors.interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    AuthGuardService,
    AuthService,
    provideToastr( {
      preventDuplicates: true
    } ),
    importProvidersFrom( NgHttpLoaderModule.forRoot() ),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient( withFetch(), withInterceptors( [authInterceptor, loggingInterceptor] ) ),
    provideRouter( routes,
      withComponentInputBinding(),
      withPreloading( PreloadAllModules )
    ),
    // provideClientHydration(withHttpTransferCacheOptions({
    //   includePostRequests: true
    // }), withEventReplay()),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideNgxWebstorage(
      withNgxWebstorageConfig( { separator: ':', caseSensitive: true } ),
      withLocalStorage(),
      withSessionStorage()
    ),
    provideHttpClient( withInterceptorsFromDi() ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    },
    {
      provide: ToastModule
    },
    JwtHelperService,
    StorageService,
    ToastrService,
    MessageService,
    NgxMaskDirective
  ]
};

