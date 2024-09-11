import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { BookitCardsComponent } from '../../../../shared/bookit-cards/bookit-cards.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-master-list',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    BookitCardsComponent,
    MatCardModule
  ],
  templateUrl: './master-list.component.html',
  styleUrl: './master-list.component.css'
})
export class MasterListComponent {
  constructor(private _formBuilder: FormBuilder) {
  }
  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 68,
  });
  items = [
    {
      id: 1,
      title: 'Country',
      description: 'Room 1 Description',
      path: "/admin/country",
      icon: 'location_on'
    },
    {
      id: 2,
      title: 'State',
      description: 'Room 1 Description',
      icon: 'location_on', path: '/layout/state',
    },
    {
      id: 3,
      title: 'City',
      description: 'Room 1 Description',
      icon: 'location_city', path: '/country',
    },
    {
      id: 4,
      title: 'Employees',
      description: 'Room 1 Description',
      icon: 'person', path: '/country',
    },
    {
      id: 5,
      title: 'Room Type',
      description: 'Room 1 Description',
      icon: 'location_on', path: '/country',
    },
    {
      id: 6,
      title: 'Room',
      description: 'Room 1 Description',
      icon: 'room', path: '/country',
    }
  ]
  events: string[] = [];
  opened: boolean = true;
}
