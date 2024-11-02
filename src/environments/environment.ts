import { provideStoreDevtools, StoreDevtoolsModule } from "@ngrx/store-devtools";

export const environment = {
  production: false,
  api: {
    //baseUrl: 'https://rdresidencyhotel.azurewebsites.net/api/'
    baseUrl: 'http://localhost:21309/api/v1/',
    baseV2Url: 'http://localhost:21309/api/v2/',
    signalrUrl: 'http://localhost:21309/'
    // baseUrl: 'https://rdresidencystaging.azurewebsites.net/api/'
    //baseUrl: 'https://roombookitapi20240912095720.azurewebsites.net/api/'
  }
};
