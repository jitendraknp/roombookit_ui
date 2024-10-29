import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PagedResponse } from '../models/response';
import { DashboardFilter } from '../models/guest';

const URL = `${ environment.api.baseUrl }dashboard/`;

@Injectable( {
  providedIn: 'root'
} )
export class DashboardService {

  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
    } )
  };

  constructor( private httpClient: HttpClient ) {
  }

  getDashboardData ( filterValue: string ): Observable<ApiResponse> {
    console.log( filterValue );
    return this.httpClient.get<ApiResponse>( `${ URL }all/dashboard/${ filterValue }`, this.httpOptions );
  }

  getGuestsData ( pageNumber: number, pageSize: number ): Observable<PagedResponse> {
    return this.httpClient.get<PagedResponse>( `${ URL }guest/${ pageNumber }/${ pageSize }`, this.httpOptions );
  }
}
