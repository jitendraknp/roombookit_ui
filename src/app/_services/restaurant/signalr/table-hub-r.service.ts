import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HubConnectionBuilder } from '@microsoft/signalr';
const URL = `${ environment.api.signalrUrl }`;

@Injectable( {
  providedIn: 'root'
} )
export class TableHubRService {

  constructor() {
    this.createConnection();
    this.hubConnection.on( 'ReceiveCreateTable', ( item ) => {
      this.addTable$.next( item );
    } );

    this.hubConnection.on( 'ReceiveUpdateTable', ( item ) => {
      console.log( item );
      this.updateTable$.next( item );
    } );

    this.hubConnection.on( 'ReceiveDeleteTable', ( id ) => {
      this.deleteTable$.next( id );
    } );
    this.startConnection();
  }

  private hubConnection!: signalR.HubConnection;

  public addTable$ = new Subject<any>();
  public updateTable$ = new Subject<any>();
  public deleteTable$ = new Subject<any>();

  private createConnection (): void {
    this.hubConnection = new HubConnectionBuilder()
      .configureLogging( signalR.LogLevel.Debug )
      .withUrl( `${ URL }tableHub`, {
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
