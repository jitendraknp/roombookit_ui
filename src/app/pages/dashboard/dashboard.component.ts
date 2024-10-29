import { Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookitCardsComponent } from '../../shared/bookit-cards/bookit-cards.component';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FooterComponent } from "../../shared/footer/footer/footer.component";
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DashboardService } from '../../_services/dashboard.service';
import { InfoDisplayComponent } from '../../shared/info-display/info-display.component';
import { DashboardFilter, DashboardGuestDetails } from '../../models/guest';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelectModule } from "@ng-select/ng-select";
import { DialogModule } from 'primeng/dialog';
import { AdvanceBookingComponent } from "../advance-booking/advance-booking.component";
import { AdvanceBooking } from '../../models/new-guest-details';
import { forkJoin } from 'rxjs';
import { BookingService } from '../../_services/booking.service';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { UtilsService } from '../../_helpers/utils.service';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


@Component( {
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BookitCardsComponent,
    RouterOutlet,
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
    ChartModule,
    DropdownModule,
    NgSelectModule,
    DialogModule,
    AdvanceBookingComponent,
    BadgeModule,
    MenuModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None
} )
export class DashboardComponent implements OnInit {
  onFilterChange () {

    let status: DashboardFilter = 'Today';
    if ( this.selectedFilter.value == 'last7days' ) {
      status = 'Days7';
    }
    if ( this.selectedFilter.value == 'Today' ) {
      status = 'Today';
    }
    if ( this.selectedFilter.value == 'last15days' ) {
      status = 'Days15';
    }
    if ( this.selectedFilter.value == 'last30days' ) {
      status = 'Days30';
    }
    forkJoin( [
      this.dashboardService.getDashboardData( status ),
      this.dashboardService.getGuestsData( this.pageNumber, this.pageSize ),
      this.bookingService.getAdvanceBooking()

    ] ).subscribe( {
      next: ( [dashboardData, guestsData, advanceBookingData] ) => {
        this.totalBookings = dashboardData.Data?.TotalBookings?.Total;
        // this.weeklyBookings = dashboardData.Data?.TotalBookings?.Weekly == null ? 0 : dashboardData.Data?.TotalBookings?.Weekly;
        this.weeklyBookings = dashboardData.Data?.TotalBookings?.CurrentWeek == null ? 0 : dashboardData.Data?.TotalBookings?.CurrentWeek;
        this.monthlyBookings = dashboardData.Data?.TotalBookings?.Monthly == null ? 0 : dashboardData.Data?.TotalBookings?.Monthly;

        this.todaysCheckIn = dashboardData.Data?.TotalBookings?.TodaysCheckIn;
        this.todaysCheckOut = dashboardData.Data?.TotalBookings?.TodaysCheckOut;
        this.availableRooms = dashboardData.Data?.RoomsAvailability?.AvailableRooms;
        this.occupiedRooms = dashboardData.Data?.RoomsAvailability?.OccupiedRooms;

        this.totalRevenue = dashboardData.Data?.DashboardRevenue?.Total;

        this.weeklyRevenue = dashboardData.Data?.DashboardRevenue?.Weekly;
        this.monthlyRevenue = dashboardData.Data?.DashboardRevenue?.Monthly;
        this.todayRevenue = dashboardData.Data?.DashboardRevenue?.Today;

        this.guestDetails = guestsData.Data as DashboardGuestDetails[];
        this.pageNumber = guestsData.PageNumber;
        this.pageSize = guestsData.PageSize;
        this.totalPages = guestsData.TotalPages;
        this.totalRecords = guestsData.TotalRecords;
        this.guestTodayDetails = this.guestDetails.filter( x => x.IsTodayCheckIn );
        this.advanceBookings = advanceBookingData.Data as AdvanceBooking[];
      },
      error: ( err ) => {
        console.error( 'Error loading data:', err );
      }
    } );
  }
  globalFilter: string = '';
  currentDate!: Date;
  totalBookings: number = 0;
  weeklyBookings: number | null = 0;
  monthlyBookings: number | null = 0;
  todaysCheckIn: number = 0;
  todaysCheckOut: number = 0;
  availableRooms: number = 0;
  occupiedRooms: number = 0;
  totalRevenue: number = 0;
  monthlyRevenue: number = 0;
  todayRevenue: number = 0;
  weeklyRevenue: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalRecords: number = 0;
  display: boolean = false;
  p: number = 1;
  guestDetails: DashboardGuestDetails[] = [];
  guestTodayDetails: DashboardGuestDetails[] = [];
  @Input() advanceBookings: AdvanceBooking[] = [];
  actionItems: MenuItem[] = [];
  bookingListActionItems: MenuItem[] = [];
  options = this._formBuilder.group( {
    bottom: 0,
    fixed: false,
    top: 68,
  } );
  noRecordsMessage = 'No record exists';
  events: string[] = [];
  opened: boolean = true;

  applyFilter ( filterValue: any ) {
    this.globalFilter = filterValue;
  }
  constructor(
    private _formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private bookingService: BookingService,
    private utilsService: UtilsService,
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
  receiveData ( data: AdvanceBooking[] ) {
    console.log( 'data' );
    console.log( data );
    this.advanceBookings = data;
  }
  ngOnInit (): void {
    this.actionItems = [
      {
        label: 'Cancel Booking',
        icon: 'pi pi-times',
        // command: () => this.cancelBooking()
      },
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        // command: () => this.viewDetails()
      }
    ];
    this.bookingListActionItems = [
      {
        label: 'Edit Booking',
        icon: 'pi pi-pencil',
        // command: () => this.cancelBooking()
      },
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        // command: () => this.viewDetails()
      }
    ];
    let defaultFilter: DashboardFilter = 'Today';
    forkJoin( [
      this.dashboardService.getDashboardData( defaultFilter ),
      this.dashboardService.getGuestsData( this.pageNumber, this.pageSize ),
      this.bookingService.getAdvanceBooking()

    ] ).subscribe( {
      next: ( [dashboardData, guestsData, advanceBookingData] ) => {
        this.totalBookings = dashboardData.Data?.TotalBookings?.Total;
        // this.weeklyBookings = dashboardData.Data?.TotalBookings?.Weekly == null ? 0 : dashboardData.Data?.TotalBookings?.Weekly;
        this.weeklyBookings = dashboardData.Data?.TotalBookings?.CurrentWeek == null ? 0 : dashboardData.Data?.TotalBookings?.CurrentWeek;
        this.monthlyBookings = dashboardData.Data?.TotalBookings?.Monthly == null ? 0 : dashboardData.Data?.TotalBookings?.Monthly;

        this.todaysCheckIn = dashboardData.Data?.TotalBookings?.TodaysCheckIn;
        this.todaysCheckOut = dashboardData.Data?.TotalBookings?.TodaysCheckOut;
        this.availableRooms = dashboardData.Data?.RoomsAvailability?.AvailableRooms;
        this.occupiedRooms = dashboardData.Data?.RoomsAvailability?.OccupiedRooms;

        this.totalRevenue = dashboardData.Data?.DashboardRevenue?.Total;

        this.weeklyRevenue = dashboardData.Data?.DashboardRevenue?.Weekly;
        this.monthlyRevenue = dashboardData.Data?.DashboardRevenue?.Monthly;
        this.todayRevenue = dashboardData.Data?.DashboardRevenue?.Today;

        this.guestDetails = guestsData.Data as DashboardGuestDetails[];
        this.pageNumber = guestsData.PageNumber;
        this.pageSize = guestsData.PageSize;
        this.totalPages = guestsData.TotalPages;
        this.totalRecords = guestsData.TotalRecords;
        this.guestTodayDetails = this.guestDetails.filter( x => x.IsTodayCheckIn );
        this.advanceBookings = advanceBookingData.Data as AdvanceBooking[];
      },
      error: ( err ) => {
        console.error( 'Error loading data:', err );
      }
    } );

  }
  options1: any;
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
  selectedFilter = { label: 'Today', value: 'today' };
  dateFilterOptions: any[] = [
    { label: 'Today', value: 'Today' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 15 Days', value: 'last15days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'Custom Date Range', value: 'custom' }
  ];
  onAdvanceBookingClicked () {
    this.display = true;
  }
}
