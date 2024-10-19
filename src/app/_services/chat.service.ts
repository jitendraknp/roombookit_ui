import {Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Subject, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:21309/chat")
    .configureLogging(signalR.LogLevel.Information)
    .build();
  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];


  // private hubConnection: signalR.HubConnection;
  // private messageSubject = new Subject<{ user: string, message: string }>();

  // messageReceived$ = this.messageSubject.asObservable();

  constructor() {
    this.start();
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string) => {
      this.messages = [...this.messages, {user, message, messageTime}];
      this.messages$.next(this.messages);
    });

    this.connection.on("ConnectedUser", (users: any) => {
      this.connectedUsers$.next(users);
    });
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl('https://localhost:5001/chathub')  // Replace with your API's URL
    //   .build();

    // this.hubConnection.on('ReceiveMessage', (user, message) => {
    //   this.messageSubject.next({ user, message });
    // });

    // this.hubConnection.start()
    //   .catch(err => console.error('Error while starting SignalR connection: ', err));
  }

  // sendMessage(user: string, message: string): void {
  //   this.hubConnection.invoke('SendMessage', user, message)
  //     .catch(err => console.error('Error while sending message: ', err));
  // }
  //start connection
  public async start() {
    try {
      await this.connection.start();
      console.log("Connection is established!");
    } catch (error) {
      console.log(error);
    }
  }

  //Join Room
  public async joinRoom(user: string, room: string) {
    return this.connection.invoke("JoinRoom", {user, room});
  }


  // Send Messages
  public async sendMessage(message: string) {
    return this.connection.invoke("SendMessage", message);
  }

  //leave
  public async leaveChat() {
    return this.connection.stop();
  }
}
