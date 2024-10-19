import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ApiResponse} from "../models/response";
const URL = `${ environment.api.baseUrl }Report/`;
@Injectable({
  providedIn: 'root'
})
export class GstReportService {
  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type': 'application/json',
    } )
  };
  constructor(private httpClient: HttpClient ) { }

  getGstReport (m:number,y:number) {
    return this.httpClient.get( `${ URL }GstReport/${m}/year/${y}`,  { responseType: 'blob' } );
  }

}
