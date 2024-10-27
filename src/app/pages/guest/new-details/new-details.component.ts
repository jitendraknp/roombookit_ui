import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { CommonModule, DatePipe, NgFor } from "@angular/common";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { RadioButtonModule } from "primeng/radiobutton";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from "primeng/card";
import { ListboxModule } from "primeng/listbox";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { FloatLabelModule } from "primeng/floatlabel";
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { DividerModule } from 'primeng/divider';
import { GuestService } from '../../../_services/guest.service';
import { ExistingGuestDetails, RoomDetails } from '../../../models/guest';
import { Booking, UpdateAddress, UpdatePhone } from '../../../models/booking';
import { BookingService } from '../../../_services/booking.service';
import { City } from '../../../models/cities';
import { CamelCaseToSpacePipe } from '../../../_helpers/camelcasetospace';
import { CommonService } from '../../../_services/common.service';
import { FluidModule } from 'primeng/fluid';
import { DatePickerModule } from 'primeng/datepicker';
@Component( {
  selector: 'app-new-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    RadioButtonModule,
    ButtonModule,
    NgFor,
    CardModule,
    ListboxModule,
    InputTextModule,
    DividerModule,
    AutoCompleteModule,
    DropdownModule,
    TooltipModule,
    TableModule,
    FloatLabelModule,
    ToastModule,
    FluidModule,
    DatePickerModule
  ],
  templateUrl: './new-details.component.html',
  styleUrl: './new-details.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, MessageService]
} )
export class NewDetailsComponent implements OnInit {
  onCitySelect ( $event: AutoCompleteSelectEvent ) {
    console.log( $event );
    // this.newBookingForm.get( 'CityId' )?.patchValue( $event.value );
  }
  @Input() selectedItem: any;
  @Input() options: string[] = [];
  @Input() companyAddress: string[] = [];
  @Input() rooms: RoomDetails[] = [];
  selectedOption: string = '';
  newBookingForm!: FormGroup;
  @Input() guestDetail?: ExistingGuestDetails;
  @Input() allCity: City[] = [];
  payments: any[] = [];
  showEditableCity: boolean = false;
  onItemSelect ( $event: AutoCompleteSelectEvent ) {
    this.newBookingForm.get( 'Rent' )?.patchValue( $event.value.Rent );
    const nod = this.newBookingForm.get( 'NoOfDays' )?.value;
    this.newBookingForm.get( 'TotalAmount' )?.patchValue( Number( $event.value.Rent ) * nod );
  }

  filteredRooms: RoomDetails[] = [];
  filterRoom ( $event: AutoCompleteCompleteEvent ) {
    console.log( this.rooms );
    const checkInDate = this.newBookingForm.get( 'CheckInDate' )?.value;
    const checkOutDate = this.newBookingForm.get( 'CheckOutDate' )?.value;
    if ( checkInDate == '' || checkOutDate == '' ) {
      this.messageService.add( { severity: 'error', summary: 'Dates Warning', detail: 'Please select check in / check out dates.' } );
      // this.toast.warning( 'Please select check in / check out dates.', "Dates Warning" );
      this.newBookingForm.get( 'RoomId' )?.patchValue( '' );
      return;
    }
    const query = $event.query;
    this.filteredRooms = this.filterRooms( query, this.rooms );

  }
  filterRooms ( query: string, rooms: RoomDetails[] ): RoomDetails[] {
    return rooms.filter( room => room.RoomNo?.toLowerCase().includes( query.toLowerCase() ) );
  }

  filteredPayments: any[] = [];
  filterPayment ( $event: AutoCompleteCompleteEvent ) {
    const query = $event.query;
    this.filteredPayments = this.filterPaymentMethod( query, this.paymentMethods );
  }
  filterPaymentMethod ( query: string, paymentMethods: any[] ): any[] {
    return paymentMethods.filter( paymentMethod => paymentMethod.label?.toLowerCase().includes( query.toLowerCase() ) );
  }
  filteredCity: City[] = [];
  filterCity ( $event: AutoCompleteCompleteEvent ) {
    const query = $event.query;
    this.filteredCity = this.filterCities( query, this.allCity );
  }
  filterCities ( query: string, cities: City[] ): any[] {
    return cities.filter( city => city.Name?.toLowerCase().includes( query.toLowerCase() ) );
  }
  filterCitiesById ( query: string, cities: City[] ): any[] {
    return cities.filter( city => city.Id?.toLowerCase().includes( query.toLowerCase() ) );
  }
  onSubmit () {
    // throw new Error( 'Method not implemented.' );
  }

  paymentMethods = [
    { label: 'Cash', value: 1 },
    { label: 'Credit Card', value: 2 },
    { label: 'PayPal', value: 3 },
    { label: 'Bank Transfer', value: 4 }
  ];

  constructor( private fb: FormBuilder, private guestService: GuestService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private commonService: CommonService,
    private bookingService: BookingService ) {
    this.newBookingForm = this.fb.group( {
      GuestId: ["", Validators.required],
      PhoneNo: [{ value: "", disabled: true }, Validators.required],
      Address: [{ value: "", disabled: true }, Validators.required],
      CityId: new FormControl<object | null>( null ),
      State: [{ value: "", disabled: true }, Validators.required],
      Country: [{ value: "", disabled: true }, Validators.required],
      CheckInDate: new FormControl<Date | null>( null, [Validators.required] ),
      CheckOutDate: ['', [Validators.required]],
      RoomId: ['', [Validators.required, Validators.min( 1 )]],
      InvoiceNo: [{ value: '', disabled: true }],
      PaymentMethod: ["Cash"],
      Rent: [0, [Validators.required, Validators.min( 1 )]],
      TotalAmount: [0, [Validators.required, Validators.min( 1 )]],
      GSTAmount: [0, [Validators.required, Validators.min( 1 )]],
      AmountPaid: [0, [Validators.required, Validators.min( 1 )]],
      Balance: [0],
      NoOfDays: [{ value: Number( this.numberOfDays ), disabled: true }, [Validators.required, Validators.min( 1 )]]
    },
      { validators: ( formGroup: AbstractControl ) => this.dateRangeValidator( formGroup ) }
    );
    this.newBookingForm.setValidators( this.dateRangeValidator );
  }
  ngAfterViewChecked (): void {
    // console.log( this.guestDetail?.GuestAddresses );
  }
  ngAfterContentChecked (): void {

    if ( this.guestDetail != null ) {
      const cities = this.allCity;
      const currentCity = cities.find( user => user.Id === this.guestDetail?.GuestAddresses?.CityId );
      this.newBookingForm.get( 'State' )?.patchValue( currentCity?.States?.Name );
      this.newBookingForm.get( 'Country' )?.patchValue( currentCity?.States?.Country?.Name );
    }

  }
  ngAfterContentInit (): void {
    // this.cdr.detectChanges();

  }

  ngAfterViewInit (): void {
    // this.cdr.detectChanges();
    this.newBookingForm.get( 'PhoneNo' )?.patchValue( this.guestDetail?.GuestAddresses?.PhoneNo );
    console.log( this.allCity );
  }
  ngOnInit (): void {
    this.cdr.detectChanges();
    this.newBookingForm.get( 'GuestId' )?.patchValue( this.selectedItem?.value.Id );

    this.newBookingForm.valueChanges.subscribe( () => {
      this.calculateDaysDifference();
      this.newBookingForm.get( 'TotalAmount' )?.patchValue( Number( this.newBookingForm.get( 'Rent' )?.value ) * this.newBookingForm.get( 'NoOfDays' )?.value, { emitEvent: false } );
      const totalAmount = Number( this.newBookingForm.get( 'Rent' )?.value ) * this.newBookingForm.get( 'NoOfDays' )?.value;
      const gstAmount = totalAmount + ( ( totalAmount * 12 ) / 100 );
      this.newBookingForm.get( 'GSTAmount' )?.patchValue( gstAmount, { emitEvent: false } );
      this.newBookingForm.get( 'Balance' )?.patchValue( gstAmount, { emitEvent: false } );
      const paidAmount = this.newBookingForm.get( 'AmountPaid' )?.value;
      const balance = gstAmount - paidAmount;
      this.newBookingForm.get( 'Balance' )?.patchValue( balance, { emitEvent: false } );

    } );
    // this.cdr.detectChanges();

  }
  // Custom validator to check if check-out date is after check-in date
  dateRangeValidator ( formGroup: AbstractControl ): ValidationErrors | null {
    const checkInDate = new Date( formGroup.get( 'CheckInDate' )?.value );
    const checkOutDate = new Date( formGroup.get( 'CheckOutDate' )?.value );

    if ( checkOutDate && checkInDate && checkOutDate <= checkInDate ) {
      return { invalidDateRange: true };
    }
    return null;
  }
  numberOfDays: number = 1;
  // Calculate the number of days between check-in and check-out
  calculateDaysDifference (): void {
    const checkInDate = new Date( this.newBookingForm.get( 'CheckInDate' )?.value );
    const checkOutDate = new Date( this.newBookingForm.get( 'CheckOutDate' )?.value );

    if ( checkInDate && checkOutDate && checkOutDate > checkInDate ) {
      // Calculate the difference in milliseconds
      const diffInMs = checkOutDate.getTime() - checkInDate.getTime();
      // Convert milliseconds to days
      this.numberOfDays = diffInMs / ( 1000 * 60 * 60 * 24 );
    } else {
      this.numberOfDays = 1;  // Reset if dates are invalid or not properly selected
    }
    this.newBookingForm.get( 'NoOfDays' )?.setValue( Math.round( this.numberOfDays ) == 0 ? 1 : Math.round( this.numberOfDays ), { emitEvent: false } );
  }
  private camelCaseToSpacePipe = new CamelCaseToSpacePipe();
  private findInvalidControls (): string[] {
    const invalidControls: string[] = [];
    const controls = this.newBookingForm.controls;
    for ( const name in controls ) {
      if ( controls[name as keyof typeof controls].invalid ) {
        invalidControls.push( this.camelCaseToSpacePipe.transform( name.replace( "Id", "" ) ) );
      }
    }
    return invalidControls;
  }
  onSave () {
    console.log( this.selectedItem?.value.Id );
    this.newBookingForm.get( 'GuestId' )?.patchValue( this.selectedItem?.value.Id );
    const invalidControls = this.findInvalidControls();
    if ( invalidControls.length > 0 ) {
      // Handle the case where there are invalid controls
      console.log( 'Invalid controls:', invalidControls );
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }


    const booking: Booking = {
      // Id: '',
      GuestsId: this.newBookingForm.get( 'GuestId' )?.value,
      // GuestsStayDetailId: '',
      RoomId: this.newBookingForm.get( 'RoomId' )?.value["RoomId"],
      NoOfDays: this.newBookingForm.get( 'NoOfDays' )?.value,
      Rent: this.newBookingForm.get( 'Rent' )?.value,
      CheckInDate: this.datePipe.transform( this.newBookingForm.get( 'CheckInDate' )?.value, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      CheckOutDate: this.datePipe.transform( this.newBookingForm.get( 'CheckOutDate' )?.value, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      PhoneNo: '',
      TotalAmount: this.newBookingForm.get( 'TotalAmount' )?.value,
      AmountWithGst: this.newBookingForm.get( 'GSTAmount' )?.value,
      AmountDue: this.newBookingForm.get( 'Balance' )?.value,
      Status: '',
      InvoiceNo: this.guestDetail?.InvoiceNo,
      BookingAddress: {
        Address: '',
        Address1: '',
        PhoneNo: "",
        // CityId: null,
        // StateId: null,
        // CountryId: null,
      },
      Payments: [
        {
          AmountPaid: Number( this.newBookingForm.get( 'AmountPaid' )?.value ),
          PaymentDate: '',
          PaymentStatus: '',
          PaymentMethod: 1,
          TransactionNo: '',
          IsFinalPayment: true,
        }
      ]
    };
    this.bookingService.saveBooking( booking ).subscribe( {
      next: ( data ) => {
        this.messageService.add( { severity: 'success', summary: 'Saved', detail: 'Booking details saved successfuly' } );
      },
      error: ( error ) => {
        console.error( 'Error saving guest', error );
      }
    } );
  }
  onPhoneNoEdit () {
    const control = this.newBookingForm.get( 'PhoneNo' )!;
    if ( control?.enabled ) {
      control.disable(); // Disable the control
      if ( control.value != null ) {
        const updatePhone: UpdatePhone = {
          GuestsId: this.selectedItem?.value.Id,
          PhoneNo: control.value
        };
        this.bookingService.updatePhoneNo( updatePhone ).subscribe( {
          next: ( resp ) => {
            this.messageService.add( { severity: 'success', summary: 'Updated', detail: 'Phone no updated successfuly.' } );
          },
          error: ( error ) => {
            this.messageService.add( { severity: 'error', summary: 'Updated', detail: 'An error occurred while updating phone no.' } );
          },
          complete: () => { }

        } );
      }
    } else {
      control.enable(); // Enable the control
    }
  }

  onAddressEdit () {
    const control = this.newBookingForm.get( 'Address' )!;
    const cityControl = this.newBookingForm.get( 'CityId' )!;

    if ( control?.enabled ) {
      control.disable();
      cityControl.disable();
      this.showEditableCity = false;
      if ( control.value != null || cityControl.value != null ) {
        const updateAddress: UpdateAddress = {
          GuestsId: this.selectedItem?.value.Id,
          Address: control.value,
          CityId: cityControl.value
        };
        this.bookingService.updateAddress( updateAddress ).subscribe( {
          next: ( resp ) => {
            if ( resp.StatusCode == 200 )
              this.messageService.add( { severity: 'success', summary: 'Updated', detail: 'Address updated successfuly.' } );
          },
          error: ( error ) => {
            this.messageService.add( { severity: 'error', summary: 'Updated', detail: 'An error occurred while updating phone no.' } );
          },
          complete: () => { }

        } );
      }
    }
    else {
      control.enable(); // Enable the control
      cityControl.enable();
      this.showEditableCity = true;
    }
  }
}
