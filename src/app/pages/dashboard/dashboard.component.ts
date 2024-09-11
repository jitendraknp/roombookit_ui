import { AfterRenderRef, AfterViewInit, Component, ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild, afterNextRender, afterRender } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BookitCardsComponent } from '../../shared/bookit-cards/bookit-cards.component';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MasterListComponent } from '../masters/master-list/master-list/master-list.component';
import { DataTablesModule } from "angular-datatables";
import { FooterComponent } from "../../shared/footer/footer/footer.component";
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
@Component( {
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    CommonModule,
    BookitCardsComponent,
    MatCardModule,
    RouterOutlet,
    MasterListComponent,
    RouterModule,
    DataTablesModule,
    FooterComponent,
    PanelModule,
    AvatarModule,
    CardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
} )
export class DashboardComponent {

  constructor( private _formBuilder: FormBuilder, private elementRef: ElementRef, private renderer: Renderer2 ) {
  }

  options = this._formBuilder.group( {
    bottom: 0,
    fixed: false,
    top: 68,
  } );
  items = [
    {
      id: 1,
      title: 'Country',
      description: 'Room 1 Description',
      icon: 'location_on'
    },
    {
      id: 2,
      title: 'State',
      description: 'Room 1 Description',
      icon: 'location_on'
    },
    {
      id: 3,
      title: 'City',
      description: 'Room 1 Description',
      icon: 'location_city'
    },
    {
      id: 4,
      title: 'Employees',
      description: 'Room 1 Description',
      icon: 'person'
    },
    {
      id: 5,
      title: 'Room Type',
      description: 'Room 1 Description',
      icon: 'location_on'
    },
    {
      id: 6,
      title: 'Room',
      description: 'Room 1 Description',
      icon: 'room'
    }
  ];
  events: string[] = [];
  opened: boolean = true;
}
