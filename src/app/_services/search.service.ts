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
export class SearchService {
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
    } )
  };

  constructor( private http: HttpClient ) {
  }

  searchCityByName ( searchBy: string ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>( `${ URL }search-city?searchBy=${ searchBy }`, searchBy, this.httpOptions );
  }

}
