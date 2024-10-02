import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/response';
const URL = `${ environment.api.baseUrl }dashboard/`;

@Injectable( {
  providedIn: 'root'
} )
export class DashboardService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
    } )
  };
  getDashboardData (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }all/dashboard`, this.httpOptions );
  }
}
