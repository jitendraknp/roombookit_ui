import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
const URL = `${ environment.api.signalrUrl }`;
@Injectable( {
  providedIn: 'root',
} )
export class NotificationService {
  private hubConnection: HubConnection;
  private notificationSubject = new Subject<string>();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl( `${ URL }notificationHub`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets // or LongPolling/ServerSentEvents
      } ) // Adjust the URL
      .build();

    this.hubConnection
      .start()
      .then( () => console.log( 'Connected to SignalR hub' ) )
      .catch( err => console.error( 'Error while connecting to SignalR hub', err ) );

    this.hubConnection.on( 'ReceiveNotification', ( message: string ) => {
      this.notificationSubject.next( message );
    } );
  }

  getNotifications () {
    return this.notificationSubject.asObservable();
  }
}
