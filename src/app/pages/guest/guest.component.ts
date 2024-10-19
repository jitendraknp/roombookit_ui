import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router';
import { NoRecordsFoundComponent } from '../no-records-found/no-records-found.component';
import { ExistingGuestDetails, Guest, RoomDetails } from '../../models/guest';
import { GuestListComponent } from "./guest-list/guest-list.component";
import { TooltipDirective } from '../../_directives/tooltip.directive';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { NgIf } from '@angular/common';
import { debounceTime, distinctUntilChanged, forkJoin, Subscription } from 'rxjs';
import { CustomMessageService } from '../../_services/custom-message.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { PanelModule } from 'primeng/panel';
import { GuestService } from "../../_services/guest.service";
import { GuestSearchService } from "../../_services/guest-search.service";
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { SearchByDTO, SearchResponse } from "../../models/searchbydto";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NewDetailsComponent } from "./new-details/new-details.component";
import { ViewDetailsComponent } from "./view-details/view-details.component";
import { City } from '../../models/cities';
import { CommonService } from '../../_services/common.service';
import { BookingService } from '../../_services/booking.service';
import { InvoiceService } from '../../_services/invoice.service';
import saveAs from 'file-saver';

@Component( {
  imports: [
    RouterOutlet,
    RouterModule,
    NoRecordsFoundComponent,
    GuestListComponent,
    TooltipDirective,
    NgxPaginationModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PanelModule,
    AutoCompleteModule,
    DialogModule,
    ButtonModule,
    NewDetailsComponent,
    ViewDetailsComponent
  ],
  selector: 'app-guest',
  standalone: true,
  styleUrl: './guest.component.css',
  templateUrl: './guest.component.html'
} )
export class GuestComponent implements OnInit, OnDestroy, AfterViewInit {
  onPrintInvoiceClick ( invoiceNo: string ) {
    // this.bookingService.getBookingByGuestId
    this.invoiceService.generateInvoiceMpci( this.selectedItem?.value?.Id, invoiceNo ).subscribe( {
      next: ( response ) => {
        saveAs( response, `${ this.selectedItem?.value?.Id }.pdf` );
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {

      }
    } );
  }


  showFullList = true;
  p: number = 1;
  public filter: string = '';
  formGroup: FormGroup = new FormGroup( {
    searchText: new FormControl<object | null>( null )
  } );
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };
  guests?: Guest[] = [];
  message: string = 'No records found.';
  path: string = '';
  subscription: Subscription;
  dv: any;
  suggestions: SearchResponse[] = [];
  searchByControl = new FormControl( { value: 1, disabled: true } );
  filterBy = [
    {
      id: 1,
      text: 'Name',
      selected: true
    },
    {
      id: 2,
      text: 'Check In Date',
      selected: false
    },
    {
      id: 3,
      text: 'Check Out Date',
      selected: false
    },
    {
      id: 4,
      text: 'Phone',
      selected: false
    },
    {
      id: 5,
      text: 'Address',
      selected: false
    }
  ];
  guestPageNumber: number = 1;
  guestPageSize: number = 5;
  guestTotalPages: number = 0;
  guestTotalRecords: number = 0;

  pageNo: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalRecords: number = 0;
  selectedItem!: any;
  display: boolean = false;
  displayViewDetails: boolean = false;

  @Output() guestId = new EventEmitter<string>();

  constructor( private route: ActivatedRoute,
    private messageService: CustomMessageService,
    private guestService: GuestService,
    private searchService: GuestSearchService,
    private bookingService: BookingService,
    private invoiceService: InvoiceService,
    private commonService: CommonService ) {
    this.subscription = this.messageService.getMessage().subscribe( message => {
      this.showFullList = message;
    } );
  }

  ngAfterViewInit (): void {
    this.guestService.getAllGuestWithPaging( this.guestPageNumber, this.guestPageSize ).subscribe( {
      next: ( response ) => {
        this.guests = response.Data as Guest[];
        this.guestPageNumber = response.PageNumber;
        this.guestPageSize = response.PageSize;
        this.guestTotalPages = response.TotalPages;
        this.guestTotalRecords = response.TotalRecords;
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {

      }
    } );

  }

  onAdd () {
    this.showFullList = false;
  }

  ngOnDestroy (): void {
    this.subscription.unsubscribe();
  }

  ngOnInit (): void {

    this.formGroup.controls['searchText'].valueChanges.subscribe( value => {
      if ( value == '' ) {
        this.selectedItem = null;
      }
      // You can perform any actions here when the value changes
    } );

  }

  filterGuest ( event: AutoCompleteCompleteEvent ) {
    const searchTerm = event.query;
    console.log( event );

    // If the input is empty, reset suggestions
    if ( !searchTerm || searchTerm.trim() === '' ) {
      this.suggestions = [];
      this.selectedItem = null;
      return;
    }
    const search: SearchByDTO = {
      FieldId: 1,
      TextToSearch: event.query,
      PageNumber: this.pageNo,
      PageSize: this.pageSize
    };
    this.searchService.searchByGuestName( search )
      .pipe(
        debounceTime( 300 ), // Wait for 300ms after the user stops typing
        distinctUntilChanged()
      )
      .subscribe( {
        next: ( res: any ) => {
          this.suggestions = res.Data as SearchResponse[];
          this.totalRecords = res.TotalRecords;
        },
        error: ( err ) => {
          console.log( err );
        },
        complete: () => {

        }
      } );
  }
  onClear ( event: any ) {
    this.selectedItem = null;
    this.guestService.getAllGuestWithPaging( this.guestPageNumber, this.guestPageSize ).subscribe( {
      next: ( response ) => {
        this.guests = response.Data as Guest[];
        this.guestPageNumber = response.PageNumber;
        this.guestPageSize = response.PageSize;
        this.guestTotalPages = response.TotalPages;
        this.guestTotalRecords = response.TotalRecords;
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {
      }
    } );
  }

  onItemSelect ( event: any ) {
    this.selectedItem = event;
    this.guestService.getGuestByIdWithPaging( this.selectedItem.value.Id, this.guestPageNumber, this.guestPageSize ).subscribe( {
      next: ( response ) => {
        this.guests = response.Data as Guest[];
        this.guestPageNumber = response.PageNumber;
        this.guestPageSize = response.PageSize;
        this.guestTotalPages = response.TotalPages;
        this.guestTotalRecords = response.TotalRecords;
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {
      }
    } );
  }

  onLazyLoad ( event: any ) {
    const searchTerm = event.query;

    // If the input is empty, reset suggestions
    if ( !searchTerm || searchTerm.trim() === '' ) {
      this.suggestions = [];
      this.selectedItem = null;
      return;
    }
    // Triggered when user scrolls to load more
    if ( event.first === 0 ) return; // If we're at the top of the list, don't load anything

    this.pageNo = Math.floor( event.first / this.pageSize ) + 1;
    const search: SearchByDTO = {
      FieldId: 1,
      TextToSearch: event.query,
      PageNumber: this.pageNo,
      PageSize: this.pageSize
    };
    // Fetch the next page of data
    this.searchService.searchByGuestName( search )
      .subscribe(
        {
          next: ( res: any ) => {
            // this.suggestions = res.Data as SearchResponse[];
            this.suggestions = [...this.suggestions, ...res.Data as SearchResponse[]]; // Append new results
            this.totalRecords = res.TotalRecords;
          },
          error: ( err ) => {
            console.log( err );
          },
          complete: () => {

          }
        } );
  }
  guestDetails: ExistingGuestDetails | null = null;
  options: string[] = [];
  companyAddress: string[] = [];
  rooms: RoomDetails[] = [];
  showDialog ( event: Event ) {
    event.preventDefault();

    this.guestId.emit( this.selectedItem );
    forkJoin( [
      this.guestService.getExistingDetailsById( this.selectedItem?.value.Id ),
      this.commonService.getAllCities(),

    ] ).subscribe( {
      next: ( [guestDetail, cityData,] ) => {

        this.guestDetails = guestDetail.Data as ExistingGuestDetails;
        this.options = [];
        this.options.push( this.guestDetails.GuestAddresses?.Address! );
        this.companyAddress.push( this.guestDetails.GuestAddresses?.CompantAddress! );
        this.rooms = this.guestDetails.RoomDetails as RoomDetails[];

        this.allCity = cityData.Data as City[];
        this.display = true;
      },
      error: ( err ) => {
        console.error( 'Error loading data:', err );
      }
    } );

  }

  showViewDetailsDialog ( event: Event ) {
    event.preventDefault();
    this.displayViewDetails = true;
  }

  handlePageChange ( event: number ): void {
    this.guestPageNumber = event;
    this.guestService.getAllGuestWithPaging( this.guestPageNumber, this.guestPageSize ).subscribe( {
      next: ( response ) => {
        this.guests = response.Data as Guest[];
        this.guestPageNumber = response.PageNumber;
        this.guestPageSize = response.PageSize;
        this.guestTotalPages = response.TotalPages;
        this.guestTotalRecords = response.TotalRecords;

      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {
        window.scrollTo( { top: 0, behavior: 'smooth' } );
      }
    } );
  }
  allCity: City[] = [];
  onBookingShow ( $event: Event ) {

  }
  guestBookings: Guest[] = [];
  onViewBookingShow ( $event: Event ) {
    console.log( 'this.guestDetails' );
    console.log( this.selectedItem );
    this.bookingService.getBookingByGuestId( this.selectedItem?.value.Id! ).subscribe( {
      next: ( response ) => {
        console.log( response );
        this.guestBookings = response.Data as Guest[];
      },
      error: ( err ) => {

      },
      complete: () => {

      }
    } );
  }
}
