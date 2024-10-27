import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SearchByDTO } from "../models/searchbydto";
import { ApiResponse, PagedResponse } from "../models/response";
import { Observable } from "rxjs";

const URL = `${ environment.api.baseUrl }Search/`;

@Injectable( {
  providedIn: 'root'
} )
export class GuestSearchService {
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
    } )
  };

  constructor( private http: HttpClient ) {
  }

  searchByGuestName ( searchBy: SearchByDTO ): Observable<PagedResponse> {
    return this.http.post<PagedResponse>( `${ URL }guest`, searchBy, this.httpOptions );
  }
  searchPartiallySavedGuests ( searchBy: SearchByDTO ): Observable<PagedResponse> {
    return this.http.post<PagedResponse>( `${ URL }search-partialsaved`, searchBy, this.httpOptions );
  }
}
