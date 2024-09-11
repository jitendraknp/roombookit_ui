import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/response';
import { environment } from '../../environments/environment';
@Injectable( {
  providedIn: 'root'
} )
export class CityService extends CrudService<ApiResponse> {
  protected override _url: string = `${ environment.api.baseUrl }City`;
  constructor( protected override _httpClient: HttpClient ) {
    super( _httpClient );
  }

  public override getAll (): Observable<ApiResponse> {

    return this._httpClient.get<ApiResponse>( `${ this._url }/all` ).pipe(
      map( data => {
        // Transform the data if necessary
        return data; // Example: you can modify or filter the data here
      } )
    );
  }
  public override add ( data: any ): Observable<ApiResponse> {
    return this._httpClient.post<ApiResponse>( `${ this._url }/save`, data ).pipe(
      map( data => {
        return data;
      } )
    );
  }
  public override update ( data: any ): Observable<ApiResponse> {
    return this._httpClient.put<ApiResponse>( `${ this._url }/update`, data ).pipe(
      map( data => {
        return data;
      } )
    );
  }
}
