import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ApiResponse } from '../models/response';
import { Hotel } from '../models/hotel';
import { environment } from '../../environments/environment';
const URL = `${ environment.api.baseUrl }Hotel/`;
// const URL = 'https://localhost:44336/api/Hotel/';
@Injectable( {
  providedIn: 'root'
} )
export class SetupHotelService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json'
    } )
  };
  getHotels () {
    return this.httpClient.get<ApiResponse>( `${ URL }GetAll`, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }

  setUpHotel ( hotel: Hotel ) {
    return this.httpClient.post<Hotel>( `${ URL }Save`, hotel, this.httpOptions ).pipe( retry( 0 ), catchError( this.handleError ) );
  }

  handleError ( error: HttpErrorResponse ) {
    const message = error.message ? error.message : error.toString();
    if ( error.status === 0 ) {
      console.log( 'An error occurred:', message );
    }
    else {
      console.log( `Backend returned code ${ error?.status }, body was: `, message );
    }
    console.log( message );
    return throwError( () => new Error( 'Something bad happened; please try again later.' + message ) );
  }
}
