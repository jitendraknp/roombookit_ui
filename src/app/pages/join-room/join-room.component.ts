import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../_services/chat.service';
import { Router } from '@angular/router';
import { StorageService } from '../../_services/storage.service';

@Component({
  standalone: true,
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css',
  imports: [
    ReactiveFormsModule,
  ]
})
export class JoinRoomComponent implements OnInit {
  joinRoomForm!: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);
  chatService = inject(ChatService);
  storageService = inject(StorageService);

  constructor() { }

  ngOnInit() {
    this.joinRoomForm = this.fb.group({
      user: ['', Validators.required],
      room: ['', Validators.required]
    });
  }//
  joinRoom() {
    const { user, room } = this.joinRoomForm.value;
    console.log(room);
    this.storageService.saveData("user", user);
    this.storageService.saveData("room", room);
    // sessionStorage.setItem("user", user);
    // sessionStorage.setItem("room", room);
    this.chatService.joinRoom(user, room)
      .then(() => {
        this.router.navigate(['admin/chat']);
      }).catch((err) => {
        console.log(err);
      })

  }
}
