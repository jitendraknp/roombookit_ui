import { Component, Input } from '@angular/core';
import { Guest } from '../../../models/guest';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,

  ],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})
export class GuestListComponent {
  @Input() guestDetails: Guest | undefined;
}
