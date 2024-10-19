import { Component, ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookitCardsComponent } from '../../shared/bookit-cards/bookit-cards.component';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MasterListComponent } from '../masters/master-list/master-list/master-list.component';
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
import { ChartModule } from 'primeng/chart';
import { NgxPaginationModule } from "ngx-pagination";
interface Room {
  id: number;
  type: string;
  price: number;
  available: boolean;
}
interface RoomN {
  id?: number;
  type?: string;
  price?: number;
  totalRooms?: number;
  availableRooms?: number;
}
interface ReservationData {
  date?: string; // Date in YYYY-MM-DD format
  totalReservations?: number;
}
interface Booking {
  roomId?: number;
  guestName?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
}
@Component( {
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BookitCardsComponent,
    RouterOutlet,
    MasterListComponent,
    RouterModule,
    FooterComponent,
    PanelModule,
    AvatarModule,
    CardModule,
    DividerModule,
    InfoDisplayComponent,
    TableModule,
    ButtonModule,
    TooltipModule,
    NgxPaginationModule,
    ChartModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
} )
export class DashboardComponent implements OnInit {
  currentDate!: Date;
  totalBookings: number = 0;
  weeklyBookings: number | null = 0;
  monthlyBookings: number | null = 0;
  todaysCheckIn: number = 0;
  todaysCheckOut: number = 0;
  availableRooms: number = 0;
  occupiedRooms: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalRecords: number = 0;
  p: number = 1;
  guestDetails: DashboardGuestDetails[] = [];
  options = this._formBuilder.group( {
    bottom: 0,
    fixed: false,
    top: 68,
  } );
  noRecordsMessage = 'No record exists';
  events: string[] = [];
  opened: boolean = true;
  rooms: Room[] = [
    { id: 1, type: 'Single Room', price: 100, available: true },
    { id: 2, type: 'Double Room', price: 150, available: false },
    { id: 3, type: 'Suite', price: 250, available: true },
    { id: 4, type: 'Deluxe Suite', price: 300, available: true },
  ];
  roomChartData = {
    labels: ['Available', 'Booked'],
    datasets: [
      {
        data: [this.rooms.filter( room => room.available ).length, this.rooms.filter( room => !room.available ).length],
        backgroundColor: ['#4caf50', '#f44336']
      }
    ]
  };
  constructor(
    private _formBuilder: FormBuilder,
    private dashboardService: DashboardService
  ) {
    this.currentDate = new Date();
  }

  handlePageChange ( event: number ): void {
    this.p = event;
    console.log( this.p );
    this.dashboardService.getGuestsData( this.p, this.pageSize ).subscribe( {
      next: ( response ) => {
        this.guestDetails = response.Data as DashboardGuestDetails[];
        this.pageNumber = response.PageNumber;
        this.pageSize = response.PageSize;
        this.totalPages = response.TotalPages;
        this.totalRecords = response.TotalRecords;
        console.log( response );
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {

      }
    } );
  }

  ngOnInit (): void {
    this.dashboardService.getDashboardData().subscribe( {
      next: ( data ) => {
        //TotalBookings
        this.totalBookings = data.Data?.TotalBookings?.Total;
        this.weeklyBookings = data.Data?.TotalBookings?.Weekly == null ? 0 : data.Data?.TotalBookings?.Weekly;
        this.monthlyBookings = data.Data?.TotalBookings?.Monthly == null ? 0 : data.Data?.TotalBookings?.Monthly;
        this.todaysCheckIn = data.Data?.TotalBookings?.TodaysCheckIn;
        this.todaysCheckOut = data.Data?.TotalBookings?.TodaysCheckOut;
        this.availableRooms = data.Data?.TotalBookings?.AvailableRooms;
        this.occupiedRooms = data.Data?.TotalBookings?.OccupiedRooms;
        // this.guestDetails = data.Data.Guests as DashboardGuestDetails[];

      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {

      }
    } );
    this.dashboardService.getGuestsData( this.pageNumber, this.pageSize ).subscribe( {
      next: ( response ) => {
        this.guestDetails = response.Data as DashboardGuestDetails[];
        this.pageNumber = response.PageNumber;
        this.pageSize = response.PageSize;
        this.totalPages = response.TotalPages;
        this.totalRecords = response.TotalRecords;
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {

      }
    } );
    const documentStyle = getComputedStyle( document.documentElement );
    const textColor = documentStyle.getPropertyValue( '--text-color' );
    this.options1 = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            display: false,
            color: textColor
          }
        }
      }
    };
  }
  options1: any;
  roomsN: RoomN[] = [
    { id: 1, type: 'Single Room', price: 100, totalRooms: 10, availableRooms: 10 },
    { id: 2, type: 'Double Room', price: 150, totalRooms: 5, availableRooms: 3 },
    { id: 3, type: 'Suite', price: 250, totalRooms: 3, availableRooms: 0 },
    { id: 4, type: 'Deluxe Suite', price: 300, totalRooms: 2, availableRooms: 1 },
  ];

  bookings: Booking[] = [];
  reservationData: ReservationData[] = [
    { date: '2024-10-01', totalReservations: 2 },
    { date: '2024-10-02', totalReservations: 4 },
    { date: '2024-10-03', totalReservations: 3 },
    { date: '2024-10-04', totalReservations: 5 },
    { date: '2024-10-05', totalReservations: 6 },
    // Add more sample data
  ];

  get reservationChartData () {
    return {
      labels: this.reservationData.map( data => data.date ),
      datasets: [
        {
          label: 'Total Reservations',
          data: this.reservationData.map( data => data.totalReservations ),
          fill: true,
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          borderColor: '#42A5F5',
          tension: 0.1
        }
      ]
    };
  }
  get roomOccupancyData () {
    const occupiedRooms = this.roomsN.map( room => room.totalRooms! - room.availableRooms! );
    const roomTypes = this.rooms.map( room => room.type );

    return {
      labels: roomTypes,
      datasets: [{
        label: 'Room Occupancy',
        data: occupiedRooms,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    };
  }

  roomTypes: string[] = [];
  get availableRoomsChartData () {
    return {
      labels: this.roomTypes,
      datasets: [
        {
          label: 'Available Rooms',
          data: this.availableRooms,
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1,
        }
      ]
    };
  }

}
