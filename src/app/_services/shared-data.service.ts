import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { Country } from '../models/countries';
import { ApiResponse } from '../models/response';
import { City } from '../models/cities';
import { States } from '../models/states';
@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  country: Country[] = [];
  city: City[] = [];
  states: States[] = [];
  public dataSource = new BehaviorSubject<Country[]>(this.country);
  public stateDataSource = new BehaviorSubject<States[]>(this.states);
  public cityDataSource = new BehaviorSubject<City[]>(this.city);
  currentData = this.dataSource.asObservable();
  currentCityData = this.cityDataSource.asObservable();
  currentStateData = this.stateDataSource.asObservable();

  constructor() { }

  changeData(country: Country[]): void {
    this.dataSource.next(country);

  }
  changeCityData(city: City[]): void {
    this.cityDataSource.next(city);

  }
  changeStateData(states: States[]) {
    console.log('changeStateData')
    console.log(states)
    this.stateDataSource.next(states);
  }
}
