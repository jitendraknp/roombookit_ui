import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoomService } from '../../_services/room.service';
import { AvailableRoom, Room } from '../../models/room';
import { CommonModule, DatePipe } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/response';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GuestStayDetail } from '../../models/guest_stay_detail';
import { GuestService } from '../../_services/guest.service';
import { RoomRentRequest } from '../../models/room-rent-request';
import { GuestBaseEntity } from '../../models/guest-base';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectedRoomsDetail } from '../../models/new-guest-details';
import { CalendarModule } from 'primeng/calendar';
import { UtilsService } from '../../_helpers/utils.service';
import { CommonService } from '../../_services/common.service';
import { City } from '../../models/cities';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
const ONE_DAY = 24 * 60 * 60 * 1000;

@Component( {
  selector: 'app-stay-guest',
  standalone: true,
  imports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    ButtonModule,
    ToastModule,
    TableModule,
    CalendarModule,
    NgxMaskDirective
  ],
  templateUrl: './stay-guest.component.html',
  styleUrls: ['./stay-guest.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, MessageService, provideNgxMask()]
} )
export class StayGuestComponent implements OnInit {
  @Input() guestList: GuestBaseEntity[] = [];
  @Input() public form!: FormGroup;
  @Input() editGuest: boolean = false;
  dateTimeValue: Date | undefined;
  selectedRooms: SelectedRoomsDetail[] = [];
  // @Input() public form!= FormGroup;
  stayGuestForm = new FormGroup( {
    CheckInDate: new FormControl<string>( '', [Validators.required,
    Validators.pattern( /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} ([01][0-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/ )] ),
    CheckOutDate: new FormControl<string>( '', [Validators.required,
    Validators.pattern( /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} ([01][0-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/ )] ),
    RoomNoId: new FormControl( [] ),
    NoOfChildren: new FormControl<number>( 0, [Validators.required] ),
    NoOfAdults: new FormControl<number>( 0, [Validators.required] ),
    GuestId: new FormControl( null ),
    NoOfGuests: new FormControl<number>( 0 ),
    RatePerNight: new FormControl<number>( 0 ),
    Discount: new FormControl<number>( 0 ),
    TotalAmount: new FormControl<number>( 0 ),
    NoOfDays: new FormControl<number>( 0 )
  },
    // { validators: this.dateRangeValidator( 'CheckInDate', 'CheckOutDate' ) }
  );
  roomService = inject( RoomService );

  public min = new Date();
  public minCheckOutDate: Date = new Date();
  inputControl = new FormControl( 0 );
  rooms: AvailableRoom[] = [];
  @Input() isEditForm: boolean = false;
  constructor(
    protected cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private guestService: GuestService,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private commonService: CommonService ) {
    // this.form = new FormGroup( {
    //   CheckInDate: new FormControl<string>( '', [Validators.required] ),
    //   CheckOutDate: new FormControl<string>( '', [Validators.required] ),
    //   RoomId: new FormControl( [], [Validators.required] ),
    //   RoomNoId: new FormControl( [], [Validators.required] ),
    //   NoOfChildren: new FormControl<number>( 0, [Validators.required] ),
    //   NoOfAdults: new FormControl<number>( 0, [Validators.required] ),
    //   GuestId: new FormControl( null ),
    //   NoOfGuests: new FormControl<number>( 0 ),
    //   RatePerNight: new FormControl<number>( 0 ),
    //   Discount: new FormControl<number>( 0 ),
    //   TotalAmount: new FormControl<number>( 0 ),
    //   BalanceAmount: new FormControl<number>( 0 ),
    //   AmountPaid: new FormControl<number>( 0 ),
    //   NoOfDays: new FormControl<number>( 0 )
    // },
    //   { validators: ( formGroup: AbstractControl ) => this.dateRangeValidator( formGroup ) }
    // );
    // this.form.setValidators( this.dateRangeValidator );
  }

  isGuidEmpty ( guid: string ): boolean {
    const emptyGuid = '00000000-0000-0000-0000-000000000000';
    return guid === emptyGuid;
  }
  dateRangeValidator ( formGroup: AbstractControl ): ValidationErrors | null {
    const checkInDate = new Date( formGroup.get( 'CheckInDate' )?.value );
    const checkOutDate = new Date( formGroup.get( 'CheckOutDate' )?.value );

    if ( checkOutDate && checkInDate && checkOutDate < checkInDate ) {
      return { invalidDateRange: true };
    }
    return null;
  }
  onChange ( $event: any ) {

  }
  get CheckInDate () {
    return this.form.get( 'CheckInDate' );
  }
  validateDateTime () {
    return ( control: any ) => {
      const dateTimeStr = control.value;

      // Check if the input matches the required format
      if ( !dateTimeStr ) {
        return null; // Allow empty string for required validation
      }

      const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2} ([01][0-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i;
      if ( !regex.test( dateTimeStr ) ) {
        return { invalidDateTime: true };
      }

      // Split date and time
      const parts = dateTimeStr.split( ' ' );
      const datePart = parts[0].split( '/' );
      const timePart = parts[1].split( ':' );

      const month = parseInt( datePart[0], 10 );
      const day = parseInt( datePart[1], 10 );
      const year = parseInt( datePart[2], 10 );
      const hour = parseInt( timePart[0], 10 );
      const minute = parseInt( timePart[1], 10 );
      const amPm = parts[2];

      // Create a date object
      const date = new Date( year, month - 1, day, amPm === 'PM' ? hour + 12 : hour, minute );

      // Validate that the constructed date matches the input
      if ( date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day ) {
        return null; // Valid date
      } else {
        return { invalidDateTime: true }; // Invalid date
      }
    };
  }
  onRoomChange ( $event: any ) {

    if ( $event == '' || $event == undefined ) {
      this.form.controls["RatePerNight"].patchValue( 0 );
      this.form.controls["Discount"].patchValue( 0 );
      this.form.controls["TotalAmount"].patchValue( 0 );
      this.form.controls["ExcGST"].patchValue( 0 );
      this.selectedRooms = [];
      return;
    }
    const invalidControls = this.utilsService.validateAndGetInvalidControls( this.form, [
      'CheckInDate',
      'CheckOutDate'
    ] );
    if ( invalidControls.length > 0 ) {
      // Handle the case where there are invalid controls
      console.log( 'Invalid controls:', invalidControls );
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    const isDateValid = this.dateRangeValidator( this.form );

    if ( isDateValid?.['invalidDateRange'] ) {
      this.messageService.add( { severity: 'error', summary: 'Date Range Error', detail: 'Start date must be before the end date' } );
      this.form.controls["RoomId"].patchValue( null );
      return;
    }
    if ( !this.form.controls["CheckInDate"].valid && !this.form.controls["CheckOutDate"].valid ) {
      this.messageService.add( { severity: 'error', summary: 'Dates', detail: 'Please enter check in / out date' } );
      this.form.controls["RoomId"].patchValue( null );
      return;
    }
    if ( !this.form.controls["GuestId"].valid ) {
      // this.toastrService.error( 'Please select guest.', 'Error' );
      this.messageService.add( { severity: 'error', summary: 'Guest', detail: 'Please select guest.' } );
      this.form.controls["GuestId"].patchValue( null );
      return;
    }

    let roomList = $event as Room[];
    let roomIds: string[] = [];
    roomList.forEach( r => {
      roomIds.push( r.Id! );
    } );

    let roomRentRequest: RoomRentRequest = {
      Id: roomIds,
      CheckInDate: this.form.controls["CheckInDate"].value!,
      CheckOutDate: this.form.controls["CheckOutDate"].value!
    };
    this.selectedRooms = [];
    this.roomService.getRoomRent( roomRentRequest ).subscribe( {
      next: ( value: any ) => {
        if ( value.StatusCode === 200 ) {
          this.selectedRooms = value.Data.BreakUps as SelectedRoomsDetail[];
          this.form.controls["RoomId"].patchValue( this.selectedRooms.map( room => room.Id ) );
          this.form.controls["RatePerNight"].patchValue( value.Data.Rent );
          this.form.controls["Discount"].patchValue( value.Data.Discount );
          this.form.controls["TotalAmount"].patchValue( value.Data.TotalAmount );
          this.form.controls["NoOfDays"].patchValue( value.Data.TotalDays );

          let gstPercentage: number = this.form.controls["GSTPercentage"].value;
          let gstAmount = ( ( Number( value.Data.TotalAmount ) * gstPercentage ) / 100 ) + Number( value.Data.TotalAmount );
          this.form.controls["ExcGST"].patchValue( gstAmount );
          if ( value.Data.Balance > 0 ) {
            this.form.controls["BalanceAmount"].patchValue( value.Data.Balance );
          }
          else {
            this.form.controls["BalanceAmount"].patchValue( gstAmount );
          }
        } else {
          // this.toastrService.error( value.Message );
          this.messageService.add( { severity: 'error', summary: 'Error', detail: value.Message } );
        }
        this.cdr.detectChanges();

      },
      error: ( error: any ) => {
        this.cdr.detectChanges();
      }
    } );
    this.stayGuestForm.controls.RatePerNight.valueChanges.subscribe( value => {
      console.log( 'Input value changed:', value );
    } );
  }

  ngOnInit (): void {
    console.log( this.isEditForm );
    if ( this.isEditForm ) {
      console.log( 'edit' );
      this.commonService.getAllRooms().subscribe( {
        next: ( response ) => {
          console.log( response.Data );
          const allRooms = response.Data as AvailableRoom[];
          this.rooms = allRooms.map( room => {
            room.RoomNo = `${ room.RoomNo } / ${ room.FloorNo } / ${ room.Type }`; // Overwrite the no property
            return room; // Return the modified room object
          } );
          this.cdr.detectChanges();

        },
        error: ( error ) => {
          console.log( error );
        }
      } );
    }
    else {
      this.commonService.getAllAvailableRooms().subscribe( {
        next: ( response ) => {
          this.rooms = response.Data as AvailableRoom[];
          this.cdr.detectChanges();

        },
        error: ( error ) => {
          console.log( error );
        }
      } );
    }

    this.form.controls["RatePerNight"].valueChanges.subscribe( value => {
      let noOfDays: number = Number( this.form.controls["NoOfDays"].value );
      let newRate: number = Number( value );
      if ( noOfDays > 0 && newRate > 0 ) {
        let totalAmount: number = noOfDays * newRate;
        this.form.controls["TotalAmount"].patchValue( totalAmount );
        let gstPercentage: number = this.form.controls["GSTPercentage"].value;
        let gstAmount = ( ( Number( totalAmount ) * gstPercentage ) / 100 ) + Number( totalAmount );
        this.form.controls["ExcGST"].patchValue( gstAmount );
        const paidAmount = this.form.controls["AmountPaid"].value;
        this.form.controls["BalanceAmount"].patchValue( gstAmount - paidAmount );

      }
    } );
    this.inputControl.patchValue( this.form.controls["RatePerNight"].value );
    this.form.controls["AmountPaid"].valueChanges.subscribe( value => {

      this.form.controls["BalanceAmount"].patchValue( this.form.controls["ExcGST"].value - value );
    } );
    let roomRentRequest: RoomRentRequest = {
      Id: this.form.controls["RoomId"].value,
      CheckInDate: this.form.controls["CheckInDate"].value!,
      CheckOutDate: this.form.controls["CheckOutDate"].value!,
      // CheckInDate: this.datePipe.transform( this.form.controls["CheckInDate"].value!, 'yyyy-MM-dd hh:mm:ss a' )!,
      // CheckOutDate: this.datePipe.transform( this.form.controls["CheckOutDate"].value!, 'yyyy-MM-dd hh:mm:ss a' )!
    };
    this.roomService.getRoomRent( roomRentRequest ).subscribe( {
      next: ( value: any ) => {
        if ( value.StatusCode === 200 ) {

          this.selectedRooms = value.Data.BreakUps as SelectedRoomsDetail[];
          console.log( this.selectedRooms );
        }
        this.cdr.detectChanges();
      },
      error: ( error: any ) => {
        this.cdr.detectChanges();
      }
    } );
  }

  onSubmit () {
    const invalidControls = this.findInvalidControls();
    if ( invalidControls.length > 0 ) {
      // Handle the case where there are invalid controls
      console.error( 'Invalid controls:', invalidControls );
      this.messageService.add( { severity: 'error', summary: 'Error', detail: invalidControls[0] } );
      return;
    } else {
      this.submitGuestStay();
    }
  }
  private findInvalidControls (): string[] {
    const invalidControls: string[] = [];
    const controls = this.stayGuestForm.controls;
    for ( const name in controls ) {
      if ( controls[name as keyof typeof controls].invalid ) {
        invalidControls.push( name );
      }
    }
    return invalidControls;
  }

  submitGuestStay () {
    let guestStayDetail: GuestStayDetail = {
      CheckInDate: this.datePipe.transform( this.stayGuestForm.controls.CheckInDate.value!, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      CheckOutDate: this.datePipe.transform( this.stayGuestForm.controls.CheckOutDate.value!, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      // RoomTypeId: Number( this.rooms.find( x => x.Id == this.stayGuestForm.controls.RoomNoId.value )?.Type ),
      RoomNoId: this.stayGuestForm.controls.RoomNoId.value!,
      NoOfGuests: this.stayGuestForm.controls.NoOfGuests.value ?? 0,
      NoOfAdults: this.stayGuestForm.controls.NoOfAdults.value!,
      NoOfChildren: this.stayGuestForm.controls.NoOfChildren.value!,
      RatePerNight: this.stayGuestForm.controls.RatePerNight.value!,
      TotalAmount: this.stayGuestForm.controls.TotalAmount.value!,
      GuestsId: this.stayGuestForm.controls.GuestId.value!,
      Discount: this.stayGuestForm.controls.Discount.value!,
      NoOfDays: this.stayGuestForm.controls.NoOfDays.value!,
    };
    this.guestService.saveGuestStayDetails( guestStayDetail ).subscribe( {
      next: ( response: ApiResponse ) => {
        if ( response.StatusCode === 200 ) {
          // this.toastrService.success( response.Message, 'Success' );
          this.messageService.add( { severity: 'success', summary: 'Success', detail: 'Success' } );
        } else {
          // this.toastrService.error( response.Message, 'Error' );
          this.messageService.add( { severity: 'error', summary: 'Error', detail: 'Error' } );
        }
      },
      error: ( error: any ) => {
        // this.toastrService.error( error.message );
      },
      complete: () => {
        this.stayGuestForm.reset();
      }
    } );
  }

  selectedChanged ( event: any ) {
    this.minCheckOutDate = event.value;
  }

  myFilter ( d: any ) {
    this.minCheckOutDate = d;
    console.log( d );
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  protected selectedTrigger ( date: Date ): void {
    console.log( date );
  };
  onRoomRemove ( event: any ) {
    console.log( 'event' );
    console.log( event );
  }
}
