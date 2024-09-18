import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class CustomMessageService {

  constructor() { }
  private subject = new Subject<any>();
  private noOfGuests = new Subject<any>();

  sendMessage ( message: boolean ) {
    this.subject.next( message );
  }

  clearMessages () {
    this.subject.next( false );
  }

  getMessage (): Observable<any> {
    return this.subject.asObservable();
  }
  clearNoOfGuests () {
    this.noOfGuests.next( 0 );
  }
  sendNoOfGuests ( totalNumber: number ) {
    this.noOfGuests.next( totalNumber );
  }
  getNoOfGuests (): Observable<any> {
    return this.noOfGuests.asObservable();
  }
}
