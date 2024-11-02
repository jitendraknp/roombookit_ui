import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
const URL = `${ environment.api.baseV2Url }`;
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/response';
@Injectable( {
  providedIn: 'root'
} )
export class RestaurantTableService {

  constructor( private httpClient: HttpClient ) { }
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json'
    } )
  };
  getAllTables (): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }restaurant/tables`, this.httpOptions );
  }
  getTableById ( id: string ): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>( `${ URL }restaurant/tables/${ id }`, this.httpOptions );
  }
  addTables ( data: any ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>( `${ URL }restaurant/tables/save`, data, this.httpOptions );
  }
  updateTable ( data: any ): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>( `${ URL }restaurant/tables/update`, data, this.httpOptions );
  }
  deleteTable ( id: string | undefined ): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>( `${ URL }restaurant/tables/delete/${ id }`, this.httpOptions );
  }
}
