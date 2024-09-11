import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
const URL = `${ environment.api.baseUrl }Dashboard/`;
@Injectable( {
  providedIn: 'root'
} )
export class DashboardService {

  constructor() { }
}
