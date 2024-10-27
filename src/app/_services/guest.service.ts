import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, PagedResponse } from '../models/response';
import { Observable } from 'rxjs';
import { GuestStayDetail } from '../models/guest_stay_detail';
import { PaymentDetail } from '../models/payment-detail';
import { IdentificationDetail } from '../models/identification-detail';
import { environment } from '../../environments/environment';
import { BookingDetails } from '../models/new-guest-details';
const URL = `${ environment.api.baseUrl }Guest/`;
// const URL = 'https://localhost:44336/api/Guest/';
@Injectable( {
  providedIn: 'root'
} )
export class GuestService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
    } )
  };
  getAllGuestWithPaging ( guestPageNumber: number, guestPageSize: number ): Observable<PagedResponse> {
    return this.httpClient.get<PagedResponse>( `${ URL }all/${ guestPageNumber }/${ guestPageSize }`, this.httpOptions );
  }
  getGuestByIdWithPaging ( id: string, guestPageNumber: number, guestPageSize: number ): Observable<PagedResponse> {
    return this.httpClient.get<PagedResponse>( `${ URL }all/${ id }/${ guestPageNumber }/${ guestPageSize }`, this.httpOptions );
  }
  getGuestByNameWithPaging ( name: string, guestPageNumber: number, guestPageSize: number ): Observable<PagedResponse> {
    return this.httpClient.get<PagedResponse>( `${ URL }all-byname/${ name }/${ guestPageNumber }/${ guestPageSize }`, this.httpOptions );
  }
  getAllGuest (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }all`, this.httpOptions );
  }
  getNewInvoiceNo ( hotelId: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }new-invno/${ hotelId }`, this.httpOptions );
  }

  getDetailsByGuestId ( id: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }${ id }/id`, this.httpOptions );
  }
  saveGuest ( data: any ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/guest`, data, this.httpOptions );
  }
  updateGuest ( data: any ): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>( `${ URL }update/guest`, data, this.httpOptions );
  }
  updatePd ( data: any ): Observable<ApiResponse> {
    return this.httpClient.patch<ApiResponse>( `${ URL }update-pd`, data, this.httpOptions );
  }
  updatePayment ( data: any ): Observable<ApiResponse> {
    return this.httpClient.patch<ApiResponse>( `${ URL }update-payment`, data, this.httpOptions );
  }
  saveGuestDetails ( data: any ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/guest-details`, data, this.httpOptions );
  }

  saveGuestStayDetails ( data: GuestStayDetail ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/stay-details`, data, this.httpOptions );
  }
  savePaymentDetails ( data: PaymentDetail ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/payment-details`, data, this.httpOptions );
  }
  saveIdentificationDetails ( data: IdentificationDetail ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/identification-details`, data, this.httpOptions );
  }
  generateInvoice ( id: string ) {
    return this.httpClient.get( `${ URL }generate-invoice/${ id }`, { responseType: 'blob' } );
  }
  getExistingDetailsById ( id: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }guest/${ id }/details`, this.httpOptions );
  }
  saveBookingDetails ( data: BookingDetails ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/booking-details`, data, this.httpOptions );
  }
}
