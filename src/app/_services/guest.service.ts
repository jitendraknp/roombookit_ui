import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/response';
import { Observable } from 'rxjs';
import { GuestStayDetail } from '../models/guest_stay_detail';
import { PaymentDetail } from '../models/payment-detail';
import { IdentificationDetail } from '../models/identification-detail';
import { environment } from '../../environments/environment';
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
  getAllGuest (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }all`, this.httpOptions );
  }
  saveGuest ( data: any ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/guest`, data, this.httpOptions );
  }
  saveGuestPersonalDetails ( data: any ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }save/personal-details`, data, this.httpOptions );
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
    return this.httpClient.get( `${ URL }generate-invoice/{id}`, { responseType: 'blob' } );
  }
}
