import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Observer, retry, throwError } from 'rxjs';
import { ApiResponse } from '../models/response';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
const URL = `${ environment.api.baseUrl }Users/`;
// const URL = 'https://localhost:21309/api/Users/';
@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0
    } )
  };
  getAll (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }all`, this.httpOptions );
  }
  getUserById ( userId: string ) {
    return this.httpClient.get<ApiResponse>( `${ URL }${ userId }`, this.httpOptions );
  }
  saveUserDetails ( user: any ) {
    return this.httpClient.post<ApiResponse>( `${ URL }save`, user, this.httpOptions );
  }
  updateUserDetails ( user: any ) {
    return this.httpClient.put<ApiResponse>( `${ URL }update`, user, this.httpOptions );
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
