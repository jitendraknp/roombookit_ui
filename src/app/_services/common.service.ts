import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/response';
const URL = `${ environment.api.baseUrl }`;
// const URL = 'https://localhost:21309/api/';
@Injectable()
export class CommonService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0
    } )
  };
  getCountries (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }Country`, this.httpOptions );
  }
  getAllStates (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }State/All`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getStates ( countryId: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }State/${ countryId }/country`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getStateById ( Id: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }State/${ Id }`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getCities ( stateId: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }City/${ stateId }/states`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getCityById ( Id: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }City/${ Id }`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getAllCities (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }City/all`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getRoles (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }Role/All`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getMenus (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }Menu/GetByRole`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getAllRooms (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }Room/all`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  updateState ( state: any ): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>( `${ URL }State/update`, state, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  saveState ( state: any ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }State/save`, state, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  handleError ( error: HttpErrorResponse ) {
    // StorageService = inject(StorageService)
    console.log( error );
    if ( error.status === 0 ) {
      console.log( 'An error occurred:', error.error );
    }
    else if ( error.status === 401 ) {

      //   if (this.storageService != undefined)
      //     this.storageService.clean();
      //   return throwError('Session expired. Please login again.');
      // }
      // else {

      //   console.log(`Backend returned code ${error?.status}, body was: `, error?.error);
      //   //return throwError(() => new Error(error.error));
      //   //this.toasterService?.error(error?.error, 'back');
      // }
      console.log( error );
    }
    return throwError( () => new Error( 'Something bad happened; please try again later.' ) );
  }
}
