import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/response';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, UpdatePhone } from '../models/booking';
import { AnyAaaaRecord } from 'dns';
import { AdvanceBooking, BookingDetails } from '../models/new-guest-details';
import { Room } from '../models/room';
const URL = `${ environment.api.baseUrl }Booking/`;
@Injectable( {
  providedIn: 'root'
} )
export class BookingService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
    } )
  };
  getBookingByGuestId ( id: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }booking/${ id }`, this.httpOptions );
  }
  getAdvanceBooking (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }advance-booking`, this.httpOptions );
  }
  saveBooking ( data: Booking ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }booking`, data, this.httpOptions );
  }
  updatePhoneNo ( data: UpdatePhone ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }update-phone`, data, this.httpOptions );
  }
  updateAddress ( data: UpdatePhone ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }update-address`, data, this.httpOptions );
  }
  updateAvailability ( data: Room ): Observable<ApiResponse> {
    return this.httpClient.patch<ApiResponse>( `${ URL }update-availability`, data, this.httpOptions );
  }
  saveBookingDetails ( data: BookingDetails ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/booking-details`, data, this.httpOptions );
  }

  saveAdvanceBookingDetails ( data: any ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/advance-booking`, data, this.httpOptions );
  }
}
