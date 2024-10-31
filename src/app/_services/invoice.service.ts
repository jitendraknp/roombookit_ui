import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const URL = `${ environment.api.baseUrl }Invoice/`;
@Injectable( {
  providedIn: 'root'
} )
export class InvoiceService {
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
    } )
  };
  constructor( private httpClient: HttpClient ) { }

  generateInvoice ( id: string, invoiceNo?: string ) {
    return this.httpClient.get( `${ URL }${ id }/invoice/${ invoiceNo }`, { responseType: 'blob' } );
  }
  generateInvoiceMpci ( id: string, invoiceNo?: string ) {
    return this.httpClient.get( `${ URL }${ id }/invoice-mpci/${ invoiceNo }`, { responseType: 'blob' } );
  }
  generate ( id: string ) {
    return this.httpClient.get( `${ URL }generate-invoice/${ id }`, { responseType: 'blob' } );
  }
}
