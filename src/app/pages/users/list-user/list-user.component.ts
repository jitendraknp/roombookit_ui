import {Component, Input} from '@angular/core';
import {User} from '../../../models/user';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [
    RouterModule,

  ],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css'
})
export class ListUserComponent {
  @Input() users!: User;
}
