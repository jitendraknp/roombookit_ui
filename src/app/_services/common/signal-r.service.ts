// services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { R_Table } from '../../models/restaurant/tables';

const URL = `${ environment.api.baseUrl }/`;

@Injectable( {
  providedIn: 'root',
} )
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private orderUpdateSubject = new Subject<any>();
  private rTablesSubject = new Subject<R_Table[]>();
  public rTablesUpdates$ = this.orderUpdateSubject.asObservable();

  public addItem$ = new Subject<any>();
  public updateItem$ = new Subject<any>();
  public deleteItem$ = new Subject<any>();

  constructor() {
    // this.createConnection();
    // this.hubConnection.on( 'ReceiveAddItem', ( item ) => {
    //   this.addItem$.next( item );
    // } );

    // this.hubConnection.on( 'ReceiveUpdateItem', ( item ) => {
    //   this.updateItem$.next( item );
    // } );

    // this.hubConnection.on( 'ReceiveDeleteItem', ( id ) => {
    //   this.deleteItem$.next( id );
    // } );
    // this.startConnection();
  }

  private createConnection (): void {
    this.hubConnection = new HubConnectionBuilder()
      .configureLogging( signalR.LogLevel.Debug )
      .withUrl( `http://localhost:21309/tableHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets // or LongPolling/ServerSentEvents
      } )
      .withAutomaticReconnect()
      .build();
  }

  private startConnection (): void {
    this.hubConnection
      .start()
      .then( () => console.log( 'SignalR connection established.' ) )
      .catch( ( err ) => console.error( 'Error while establishing SignalR connection: ', err ) );
  }
}
