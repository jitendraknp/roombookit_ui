import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../_services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../_services/storage.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chatService = inject(ChatService);
  storageService = inject(StorageService);
  inputMessage = "";
  messages: any[] = [];
  router = inject(Router);
  loggedInUserName = this.storageService.getData("user");
  roomName = this.storageService.getData("room");
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;
  ngOnInit(): void {
    this.chatService.messages$.subscribe(res => {
      this.messages = res;
      console.log(this.messages)
    });

    this.chatService.connectedUsers$.subscribe(res => {
      console.log(res);

    })
  }
  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }
  sendMessage() {
    this.chatService.sendMessage(this.inputMessage)
      .then(() => {
        this.inputMessage = '';
      }).catch((err) => {
        console.log(err);
      })
  }

  leaveChat() {
    this.chatService.leaveChat()
      .then(() => {
        this.router.navigate(['welcome']);
        setTimeout(() => {
          location.reload();
        }, 0);
      }).catch((err) => {
        console.log(err);
      })
  }
}
