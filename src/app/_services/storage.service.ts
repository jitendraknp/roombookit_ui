import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

const USER_KEY = 'auth-user';
@Injectable( {
  providedIn: 'root'
} )
export class StorageService {

  constructor( private sessionStorageService: SessionStorageService ) { }

  clean (): void {
    this.sessionStorageService.clear( USER_KEY );
  }

  public saveUser ( user: any ): void {
    this.sessionStorageService.store( USER_KEY, JSON.stringify( user ) );
  }

  public getUser (): any {
    return JSON.parse( this.sessionStorageService.retrieve( USER_KEY ) );
  }

  public isLoggedIn (): boolean {
    const user = this.sessionStorageService.retrieve( USER_KEY );
    return !!user;
  }
  public saveData ( data: any, key: string ): void {
    this.sessionStorageService.store( key, JSON.stringify( data ) );
  }
  public getData ( key: string ): void {
    return JSON.parse( this.sessionStorageService.retrieve( key ) );
  }
}
