import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { SetupAdmin } from '../models/admin-setup';
import { ApiResponse } from '../models/response';

@Injectable( {
  providedIn: 'root'
} )
export class AdminSetupService {
  apiUrl = 'http://localhost:21309/api/users/setup';
  apiUrl1 = 'http://localhost:21309/api/users/SuperAdmin';

  setupAdmin ( data: SetupAdmin ) {
    return this.httpClient.post( this.apiUrl, data, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getSuperAdmin () {
    return this.httpClient.get<ApiResponse>( this.apiUrl1, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json'
    } )
  };

  handleError ( error: HttpErrorResponse ) {
    if ( error.status === 0 ) {
      console.log( 'An error occurred:', error.error );
    }
    else {
      console.log( `Backend returned code ${ error?.status }, body was: `, error?.error );
    }
    console.log( error );
    return throwError( () => new Error( 'Something bad happened; please try again later.' ) );
  }
}
