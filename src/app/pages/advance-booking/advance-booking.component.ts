import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../_services/booking.service';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AdvanceBooking, RoomCategory } from '../../models/new-guest-details';
import { MessageService } from 'primeng/api';
import { UtilsService } from '../../_helpers/utils.service';
interface Gender {
  name: string;
  code: string;
}
@Component( {
  selector: 'app-advance-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    NgSelectModule,
    ButtonModule,
    CalendarModule,
    DatePickerModule,
    TableModule,
    SelectModule,
    FluidModule
  ],
  templateUrl: './advance-booking.component.html',
  styleUrl: './advance-booking.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
} )
export class AdvanceBookingComponent implements OnInit {
  constructor( private bookingService: BookingService, private fb: FormBuilder, private datePipe: DatePipe,
    private messageService: MessageService, private utilsService: UtilsService, ) {
    this.advanceBookingForm = this.fb.group( {
      FirstName: new FormControl( '', [Validators.required] ),
      LastName: new FormControl( "", [Validators.required] ),
      Address: new FormControl( "" ),
      Status: new FormControl( { code: "Booked", name: "Booked" } ),
      Gender: new FormControl( { name: 'MALE', code: 'MALE' } ),
      PhoneNo: new FormControl( '', [Validators.required] ),
      Email: new FormControl( '' ),
      RoomCategoryIds: this.fb.array( [], [Validators.required] ),
      CheckInDate: new FormControl<Date | null>( null ),
      CheckOutDate: new FormControl<Date | null>( null ),
      BookingDate: new FormControl<Date | null>( null ),
      NoOfGuests: new FormControl( 0 ),
      BookingAmount: new FormControl( 0 ),
      tableRows: this.fb.array( this.roomTypes.map( item => this.createTableRow( item ) ) )
    } );
  }
  @Output() advanceBookings: EventEmitter<AdvanceBooking[]> = new EventEmitter();
  // Create a form group for each row in the table
  createTableRow ( item: any ): FormGroup {
    return this.fb.group( {
      id: [item.id],
      selected: [item.selected], // The checkbox form control
      name: [item.name],
      nos: [item.nos]
    } );
  }
  gender: Gender[] = [
    { name: 'MALE', code: 'MALE' },
    { name: 'FEMALE', code: 'FEMALE' },
    { name: 'OTHERS', code: 'OTHERS' }
  ];
  bookingStatus: any[] = [
    { name: 'Booked', code: 'Booked' },
    { name: 'Pending', code: 'Pending' },
    { name: 'Not Available', code: 'Not Available' }
  ];
  roomTypes = [
    {
      'id': 1,
      'name': 'Non AC (Single)',
      'nos': 0,
      'selected': false
    },
    {
      'id': 2,
      'name': 'AC (Single)',
      'nos': 0,
      'selected': false
    },
    {
      'id': 3,
      'name': 'Non AC (Double)',
      'nos': 0,
      'selected': false
    },
    {
      'id': 4,
      'name': 'AC (Double)',
      'nos': 0,
      'selected': false
    },
    {
      'id': 5,
      'name': 'Single',
      'nos': 0,
      'selected': false
    },
    {
      id: 6,
      'name': 'Double',
      'nos': 0,
      'selected': false
    },
    {
      'id': 7,
      'name': 'Triple',
      'nos': 0,
      selected: false
    }
  ];
  selectedCategory!: any;
  advanceBookingForm!: FormGroup;
  // Getter for the FormArray
  get tableRows (): FormArray {
    return this.advanceBookingForm.get( 'tableRows' ) as FormArray;
  }
  ngOnInit (): void {

  }
  onSubmit () {
    const invalidControls = this.utilsService.validateAndGetInvalidControls( this.advanceBookingForm, [
      'FirstName',
      'LastName',
      'PhoneNo',
    ] );
    if ( invalidControls.length > 0 ) {
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    const roomCategoryIds: RoomCategory[] = [];
    const values = this.tableRows.controls.map( control => control.value );
    this.tableRows.controls.forEach( ( control, index ) => {
      if ( control.value.selected ) {
        roomCategoryIds.push( {
          Id: control.value.id,
          Status: 'Booked',
          NoOfRooms: Number( control.value.nos )
        } );
      }
    } );
    if ( roomCategoryIds.length == 0 ) {
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: 'Room Category and Total of Rooms' } );
      return;
    }

    const ab: AdvanceBooking = {
      FirstName: this.advanceBookingForm.get( 'FirstName' )?.value,
      LastName: this.advanceBookingForm.get( 'LastName' )?.value,
      PhoneNo: this.advanceBookingForm.get( 'PhoneNo' )?.value,
      Email: this.advanceBookingForm.get( 'Email' )?.value,
      Address: this.advanceBookingForm.get( 'Address' )?.value,
      BookingAmount: this.advanceBookingForm.get( 'BookingAmount' )?.value,
      Status: this.advanceBookingForm.get( 'Status' )?.value["code"],
      BookingDate: this.advanceBookingForm.get( 'BookingDate' )?.value == null ? '' : this.datePipe.transform( this.advanceBookingForm.get( 'BookingDate' )?.value!, 'dd/MM/yyyy hh:mm a' )!.toString(),
      CheckInDate: this.advanceBookingForm.get( 'CheckInDate' )?.value == null ? '' : this.datePipe.transform( this.advanceBookingForm.get( 'CheckInDate' )?.value!, 'dd/MM/yyyy hh:mm a' )!.toString(),
      CheckOutDate: this.advanceBookingForm.get( 'CheckOutDate' )?.value == null ? '' : this.datePipe.transform( this.advanceBookingForm.get( 'CheckOutDate' )?.value!, 'dd/MM/yyyy hh:mm a' )!.toString(),
      NoOfGuests: 1,
      RoomCategoryId: roomCategoryIds
    };
    console.log( ab );
    this.bookingService.saveAdvanceBookingDetails( ab ).subscribe( {
      next: ( response ) => {
        if ( response.StatusCode == 200 ) {
          this.messageService.add( { severity: 'success', summary: 'Saved', detail: response.Message } );
          this.advanceBookings.emit( response.Data );
        }
        else {
          this.messageService.add( { severity: 'error', summary: 'Error', detail: response.Message } );
        }
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {

      }
    } );
  }
  onSelectionChange ( event: any ) {

  }
  // Triggered when a row (or checkbox) is selected
  onRowSelect ( event: any ) {
    const selectedRow = event.data;

    const selectedIndex = this.tableRows.controls.findIndex( row => row.value.id === selectedRow.id );
    if ( selectedIndex !== -1 ) {
      const selectedFormGroup = this.tableRows.at( selectedIndex ) as FormGroup;
      selectedFormGroup.get( 'selected' )?.setValue( true );
      const nosVal = selectedFormGroup.get( 'nos' )?.value;
      if ( Number( nosVal ) <= 0 ) {
        selectedFormGroup.get( 'nos' )?.setValidators( [Validators.required] );
        selectedFormGroup.get( 'nos' )?.updateValueAndValidity();
      }
    }
  }
  // Method to check if the row form is valid;
  isRowValid ( index: number ): boolean {
    const rowForm = this.tableRows.at( index ) as FormGroup;
    return rowForm.valid;
  }
  // Triggered when a row (or checkbox) is unselected
  onRowUnselect ( event: any ) {
    const selectedRow = event.data;
    const selectedIndex = this.tableRows.controls.findIndex( row => row.value.id === selectedRow.id );
    if ( selectedIndex !== -1 ) {
      const selectedFormGroup = this.tableRows.at( selectedIndex ) as FormGroup;
      selectedFormGroup.get( 'selected' )?.setValue( false );
      selectedFormGroup.get( 'nos' )?.removeValidators( [Validators.required] );
      selectedFormGroup.get( 'nos' )?.updateValueAndValidity();
    }
  }
}
