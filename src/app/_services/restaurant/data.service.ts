import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class DataService {
  private data: any;
  constructor() { }
  // Method to set data
  setData ( data: any ): void {
    this.data = data;
  }

  // Method to get data
  getData (): any {
    return this.data;
  }

  // Method to clear data
  clearData (): void {
    this.data = null;
  }
}
