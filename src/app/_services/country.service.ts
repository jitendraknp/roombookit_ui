import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../models/countries';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ApiResponse } from '../models/response';
import { environment } from '../../environments/environment';
const URL = `${ environment.api.baseUrl }Country/`;
// const URL = 'https://localhost:21309/api/Country/';

@Injectable( {
  providedIn: 'root'
} )
export class CountryService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json'
    } )
  };
  addCountry ( country: any ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save`, country, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );;
  }
  getCountryById ( id: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }${ id }`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );;
  }
  getAll (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  updateCountry ( country: Country ): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>( `${ URL }update`, country, this.httpOptions );
  }
  handleError ( error: HttpErrorResponse ) {
    console.log( error );
    if ( error.status === 0 ) {
      console.log( 'An error occurred:', error.error );
    }
    else if ( error.status === 401 ) {
      return throwError( 'Session expired. Please login again.' );
    }
    else {

      console.log( `Backend returned code ${ error?.status }, body was: `, error?.error );
      //return throwError(() => new Error(error.error));
      //this.toasterService?.error(error?.error, 'back');
    }
    console.log( error );
    return throwError( () => new Error( 'Something bad happened; please try again later.' ) );
  }
}

