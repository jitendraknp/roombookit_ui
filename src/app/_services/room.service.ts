import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ApiResponse } from '../models/response';
import { RoomRentRequest } from '../models/room-rent-request';
import { environment } from '../../environments/environment';
const URL = `${ environment.api.baseUrl }Room/`;
// const URL = 'http://localhost:21309/api/Room/';
@Injectable( {
  providedIn: 'root'
} )
export class RoomService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json'
    } )
  };
  addRoom ( room: any ) {
    return this.httpClient.post<ApiResponse>( `${ URL }save`, room, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  updateRoom ( room: any ): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>( `${ URL }update`, room, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getAllRooms () {
    return this.httpClient.get<ApiResponse>( `${ URL }all`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getRoomById ( id: string ) {
    return this.httpClient.get<ApiResponse>( `${ URL }${ id }/getDetails` ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getRoomRentById ( id: string ) {
    return this.httpClient.get<any>( `${ URL }${ id }/rent` ).pipe( retry( 0 ), catchError( this.handleError ) );
  }
  getRoomRent ( roomRentRequest: RoomRentRequest ) {
    return this.httpClient.post<ApiResponse>( `${ URL }rent`, roomRentRequest, this.httpOptions );
  }
  handleError ( error: HttpErrorResponse ) {
    const message = error.message ? error.message : error.toString();
    if ( error.status === 0 ) {
      console.log( 'An error occurred:', error.error );
    }
    else {
      console.log( `Backend returned code ${ error?.status }, body was: `, error?.error );
    }
    return throwError( () => new Error( 'Something bad happened; please try again later.' ) );
  }
}

