import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoomService } from '../../_services/room.service';
import { AvailableRoom, Room } from '../../models/room';
import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS, DatePipe } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RoomRentRequest } from '../../models/room-rent-request';
import { GuestBaseEntity } from '../../models/guest-base';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectedRoomsDetail } from '../../models/new-guest-details';
import { CalendarModule } from 'primeng/calendar';
import { UtilsService } from '../../_helpers/utils.service';
import { CommonService } from '../../_services/common.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ActivatedRoute } from '@angular/router';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
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
    NgxMaskDirective,
    FluidModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    DatePickerModule
  ],
  templateUrl: './stay-guest.component.html',
  styleUrls: ['./stay-guest.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, MessageService, provideNgxMask(), { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: 'dd/MM/yyyy HH:mm a' } }]
} )
export class StayGuestComponent implements OnInit, OnChanges {
  onCheckInDateSelect ( arg0: Date ) {
    this.form.controls["CheckInDate"].patchValue( this.datePipe.transform( this.form.controls["CheckInDate"].value!, 'dd/MM/yyyy hh:mm a' )!.toString() );
  }
  onCheckOutDateSelect ( arg0: Date ) {
    this.form.controls["CheckOutDate"].patchValue( this.datePipe.transform( this.form.controls["CheckOutDate"].value!, 'dd/MM/yyyy hh:mm a' )!.toString() );
  }
  @Input() guestList: GuestBaseEntity[] = [];

  @Input() public form!: FormGroup;
  @Input() public paymentDetailsForm!: FormGroup;

  @Input() editGuest: boolean = false;
  dateTimeValue: Date | undefined;
  selectedRooms: SelectedRoomsDetail[] = [];

  roomService = inject( RoomService );

  public min = new Date();
  public minCheckOutDate: Date = new Date();
  inputControl = new FormControl( 0 );
  rooms: AvailableRoom[] = [];
  @Input() isEditForm: boolean = false;
  constructor(
    private route: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private commonService: CommonService ) {

  }

  getCheckinDateInputStyleClass () {
    const control = this.form.get( 'CheckInDate' );
    if ( control?.invalid ) {
      return 'ng-invalid text-sm';
    }
    else {
      return 'ng-valid text-sm';
    }
  }
  getCheckoutDateInputStyleClass () {
    const control = this.form.get( 'CheckOutDate' );
    if ( control?.invalid ) {
      return 'ng-invalid text-sm';
    }
    else {
      return 'ng-valid text-sm';
    }
  }
  get CheckInDate () {
    return this.form.get( 'CheckInDate' );
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
      CheckOutDate: this.form.controls["CheckOutDate"].value!,
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
          let gstPercentage: number = this.paymentDetailsForm.controls["GSTPercentage"].value;
          let gstAmount = ( ( Number( value.Data.TotalAmount ) * gstPercentage ) / 100 ) + Number( value.Data.TotalAmount );

          this.paymentDetailsForm.controls["AmountPaid"].patchValue( gstAmount );
          let paid = this.paymentDetailsForm.controls["AmountPaid"].value;

          this.paymentDetailsForm.controls["ExcGST"].patchValue( gstAmount );
          this.paymentDetailsForm.controls["BalanceAmount"].patchValue( gstAmount - paid );
        } else {
          // this.toastrService.error( value.Message );
          this.messageService.add( { severity: 'error', summary: 'Error', detail: value.Message } );
          this.form.controls["RoomId"].patchValue( null );
        }
        this.cdr.detectChanges();
      },
      error: ( error: any ) => {
        this.cdr.detectChanges();
      }
    } );
  }
  guestId: string = '';

  ngOnChanges ( changes: SimpleChanges ) {
    if ( changes['form'] && this.form instanceof FormGroup ) {
      if ( this.form ) {

        if ( this.isEditForm ) {
          console.log( 'edit' );
          this.route.params.subscribe( param => {
            this.guestId = param["guest-id"];
          } );
          this.commonService.getAllRoomsByGuestId( this.guestId ).subscribe( {
            next: ( response ) => {
              console.log( response.Data );
              this.rooms = response.Data as AvailableRoom[];
              // this.rooms = allRooms.map( room => {
              //   room.RoomNo = `${ room.RoomNo } / ${ room.FloorNo } / ${ room.Type }`; // Overwrite the no property
              //   return room; // Return the modified room object
              // } );
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
        const formGroup = this.form as FormGroup;
        formGroup.controls["RatePerNight"]?.valueChanges.subscribe( value => {
          let noOfDays: number = Number( this.form.controls["NoOfDays"].value );
          let newRate: number = Number( value );
          if ( noOfDays > 0 && newRate > 0 ) {
            let totalAmount: number = noOfDays * newRate;
            this.form.controls["TotalAmount"].patchValue( totalAmount );
            let gstPercentage: number = this.paymentDetailsForm.controls["GSTPercentage"].value;
            let gstAmount = ( ( Number( totalAmount ) * gstPercentage ) / 100 ) + Number( totalAmount );
            this.paymentDetailsForm.controls["ExcGST"].patchValue( gstAmount );
            const paidAmount = this.form.controls["AmountPaid"].value;
            this.paymentDetailsForm.controls["BalanceAmount"].patchValue( gstAmount - paidAmount );
          }
        } );
        this.inputControl.patchValue( this.form.controls["RatePerNight"].value );
        formGroup.controls["AmountPaid"].valueChanges.subscribe( value => {
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
    }
  }
  ngOnInit (): void {

  }

  // onSubmit () {
  //   const invalidControls = this.findInvalidControls();
  //   if ( invalidControls.length > 0 ) {
  //     // Handle the case where there are invalid controls
  //     console.error( 'Invalid controls:', invalidControls );
  //     this.messageService.add( { severity: 'error', summary: 'Error', detail: invalidControls[0] } );
  //     return;
  //   } else {
  //     this.submitGuestStay();
  //   }
  // }
  // private findInvalidControls (): string[] {
  //   const invalidControls: string[] = [];
  //   const controls = this.stayGuestForm.controls;
  //   for ( const name in controls ) {
  //     if ( controls[name as keyof typeof controls].invalid ) {
  //       invalidControls.push( name );
  //     }
  //   }
  //   return invalidControls;
  // }

  // submitGuestStay () {
  //   let guestStayDetail: GuestStayDetail = {
  //     CheckInDate: this.form.controls['CheckInDate'].value!,
  //     CheckOutDate: this.form.controls.CheckOutDate.value!,
  //     // RoomTypeId: Number( this.rooms.find( x => x.Id == this.stayGuestForm.controls.RoomNoId.value )?.Type ),
  //     RoomNoId: this.form.controls.RoomNoId.value!,
  //     NoOfGuests: this.form.controls.NoOfGuests.value ?? 0,
  //     NoOfAdults: this.form.controls.NoOfAdults.value!,
  //     NoOfChildren: this.form.controls.NoOfChildren.value!,
  //     RatePerNight: this.form.controls.RatePerNight.value!,
  //     TotalAmount: this.form.controls.TotalAmount.value!,
  //     GuestsId: this.form.controls.GuestId.value!,
  //     Discount: this.form.controls.Discount.value!,
  //     NoOfDays: this.form.controls.NoOfDays.value!,
  //   };
  //   this.guestService.saveGuestStayDetails( guestStayDetail ).subscribe( {
  //     next: ( response: ApiResponse ) => {
  //       if ( response.StatusCode === 200 ) {
  //         // this.toastrService.success( response.Message, 'Success' );
  //         this.messageService.add( { severity: 'success', summary: 'Success', detail: 'Success' } );
  //       } else {
  //         // this.toastrService.error( response.Message, 'Error' );
  //         this.messageService.add( { severity: 'error', summary: 'Error', detail: 'Error' } );
  //       }
  //     },
  //     error: ( error: any ) => {
  //       // this.toastrService.error( error.message );
  //     },
  //     complete: () => {
  //       this.form.reset();
  //     }
  //   } );
  // }

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
