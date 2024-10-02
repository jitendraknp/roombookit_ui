import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
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
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DashboardService } from '../../_services/dashboard.service';
import { InfoDisplayComponent } from '../../shared/info-display/info-display.component';
import { DashboardGuestDetails } from '../../models/guest';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
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
    CardModule,
    DividerModule,
    InfoDisplayComponent,
    TableModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
} )
export class DashboardComponent implements OnInit {
  currentDate!: Date;
  totalBookings: number = 0;
  weeklyBookings: number = 0;
  monthlyBookings: number = 0;
  todaysCheckIn: number = 0;
  todaysCheckOut: number = 0;
  availableRooms: number = 0;
  occupiedRooms: number = 0;
  guestDetails: DashboardGuestDetails[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dashboardService: DashboardService
  ) {
    this.currentDate = new Date();
  }

  ngOnInit (): void {
    this.dashboardService.getDashboardData().subscribe( {
      next: ( data ) => {
        //TotalBookings 
        this.totalBookings = data.Data?.TotalBookings?.Total;
        this.weeklyBookings = data.Data?.TotalBookings?.Weekly;
        this.monthlyBookings = data.Data?.TotalBookings?.Monthly;
        this.todaysCheckIn = data.Data?.TotalBookings?.TodaysCheckIn;
        this.todaysCheckOut = data.Data?.TotalBookings?.TodaysCheckOut;
        this.availableRooms = data.Data?.TotalBookings?.AvailableRooms;
        this.occupiedRooms = data.Data?.TotalBookings?.OccupiedRooms;
        this.guestDetails = data.Data.Guests as DashboardGuestDetails[];
        console.log( data );
      },
      error: ( error ) => {

      },
      complete: () => {

      }
    } );
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
