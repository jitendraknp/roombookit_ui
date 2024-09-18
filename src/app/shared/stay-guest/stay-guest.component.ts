import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoomService } from '../../_services/room.service';
import { Room } from '../../models/room';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/response';
import { ToastrService } from 'ngx-toastr';
import { GuestStayDetail } from '../../models/guest_stay_detail';
import { GuestService } from '../../_services/guest.service';
import { RoomRentRequest } from '../../models/room-rent-request';
import { GuestBaseEntity } from '../../models/guest-base';
import { IonicModule } from '@ionic/angular';
import { IonAccordion } from '@ionic/angular/standalone';
import { CustomMessageService } from '../../_services/custom-message.service';
import { ButtonModule } from 'primeng/button';
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
    IonicModule,
    IonAccordion,
    BsDatepickerModule,
    ButtonModule,
    TimepickerModule],
  templateUrl: './stay-guest.component.html',
  styleUrl: './stay-guest.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
} )
export class StayGuestComponent implements OnInit, AfterContentChecked, OnDestroy {
  onChange ( $event: any ) {
    console.log( $event );
  }
  @Input() guestList: GuestBaseEntity[] = [];
  @Input() public form!: FormGroup;

  onRoomChange ( $event: string ) {

    if ( $event == '' || $event == undefined ) {
      this.form.controls["RatePerNight"].patchValue( 0 );
      this.form.controls["Discount"].patchValue( 0 );
      return;
    }
    if ( !this.form.controls["CheckInDate"].valid && !this.form.controls["CheckOutDate"].valid ) {
      this.toastrService.error( 'Please enter check in / out date.', 'Error' );
      this.form.controls["RoomNoId"].patchValue( null );
      return;
    }
    if ( !this.form.controls["GuestId"].valid ) {
      this.toastrService.error( 'Please select guest.', 'Error' );
      this.form.controls["GuestId"].patchValue( null );
      return;
    }
    let roomRentRequest: RoomRentRequest = {
      Id: $event,
      CheckInDate: this.datePipe.transform( this.form.controls["CheckInDate"].value!, 'yyyy-MM-dd hh:mm:ss a' )!,
      CheckOutDate: this.datePipe.transform( this.form.controls["CheckOutDate"].value!, 'yyyy-MM-dd hh:mm:ss a' )!
    };
    this.roomService.getRoomRent( roomRentRequest ).subscribe( {
      next: ( value: any ) => {
        console.log( value );
        if ( value.StatusCode === 200 ) {
          this.form.controls["RatePerNight"].patchValue( value.Data.Rent );
          this.form.controls["Discount"].patchValue( value.Data.Discount );
          this.form.controls["TotalAmount"].patchValue( value.Data.TotalAmount );
          this.form.controls["NoOfDays"].patchValue( value.Data.TotalDays );
        } else {
          this.toastrService.error( value.Message );
        }
        this.cdr.detectChanges();
      },
      error: ( error: any ) => {
        this.toastrService.error( error.message );
        this.cdr.detectChanges();
      }
    } );
  }
  // @Input() public form!= FormGroup;
  stayGuestForm = new FormGroup( {
    GuestId: new FormControl( null ),
    CheckInDate: new FormControl<Date>( new Date(), [Validators.required] ),
    CheckOutDate: new FormControl<string>( '', [Validators.required] ),
    RoomNoId: new FormControl( null, [Validators.required] ),
    NoOfGuests: new FormControl<number>( { value: 1, disabled: true }, [Validators.required] ),
    NoOfAdults: new FormControl<number>( 0, [Validators.required] ),
    NoOfChildren: new FormControl<number>( 0, [Validators.required] ),
    RatePerNight: new FormControl<number>( { value: 0, disabled: true } ),
    Discount: new FormControl<number>( { value: 0, disabled: true } ),
    TotalAmount: new FormControl<number>( 0 ),
    NoOfDays: new FormControl<number>( 0 )
  } );
  protected selectedDates: [Date, Date] = [
    new Date( Date.now() - ONE_DAY ),
    new Date( Date.now() + ONE_DAY )
  ];

  protected currentValue: Date = new Date( this.selectedDates[0] );
  protected endValue: Date = new Date( this.selectedDates[1] );
  roomService = inject( RoomService );
  room$!: Observable<ApiResponse | any>;
  public min = new Date();
  public minCheckOutDate: Date = new Date();

  constructor(
    protected cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private guestService: GuestService,
    private messageService: CustomMessageService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder, ) {

  }
  ngOnDestroy (): void {
    this.room$.subscribe().unsubscribe();
  };
  ngAfterContentChecked (): void {

    this.cdr.detectChanges();
  }
  protected selectedTrigger ( date: Date ): void {
    console.log( date );
  };
  rooms: Room[] = [];
  ngOnInit (): void {
    this.room$ = this.roomService.getAllRooms();
    this.room$.subscribe( rooms => {
      this.rooms = rooms.Data as Room[];
    } );
    this.messageService.getNoOfGuests().subscribe( {
      next: ( result ) => {
        this.stayGuestForm.controls.NoOfGuests.patchValue( result + 1 );
      }
    } );
  }
  onSubmit () {
    console.log( this.stayGuestForm );
    if ( this.stayGuestForm.invalid ) {
      this.toastrService.error( 'Please enter a valid data.', 'Error' );
    }
    else {

      this.submitGuestStay();
    }
  }
  submitGuestStay () {
    let guestStayDetail: GuestStayDetail = {
      CheckInDate: this.datePipe.transform( this.stayGuestForm.controls.CheckInDate.value!, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      CheckOutDate: this.datePipe.transform( this.stayGuestForm.controls.CheckOutDate.value!, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      RoomTypeId: Number( this.rooms.find( x => x.Id == this.stayGuestForm.controls.RoomNoId.value )?.Type ),
      RoomNoId: this.stayGuestForm.controls.RoomNoId.value!,
      NoOfGuests: this.stayGuestForm.controls.NoOfGuests.value ?? 0,
      NoOfAdults: this.stayGuestForm.controls.NoOfAdults.value!,
      NoOfChildren: this.stayGuestForm.controls.NoOfChildren.value!,
      RatePerNight: this.stayGuestForm.controls.RatePerNight.value!,
      TotalAmount: this.stayGuestForm.controls.TotalAmount.value!,
      GuestId: this.stayGuestForm.controls.GuestId.value!,
      Discount: this.stayGuestForm.controls.Discount.value!,
      NoOfDays: this.stayGuestForm.controls.NoOfDays.value!,
    };
    this.guestService.saveGuestStayDetails( guestStayDetail ).subscribe( {
      next: ( response: ApiResponse ) => {
        if ( response.StatusCode === 200 ) {
          this.toastrService.success( response.Message, 'Success' );
        }
        else {
          this.toastrService.error( response.Message, 'Error' );
        }
      },
      error: ( error: any ) => {
        this.toastrService.error( error.message );
      },
      complete: () => {
        this.stayGuestForm.reset();
      }
    } );
  }
  selectedChanged ( event: any ) {
    console.log( 'selectedChanged' );
    console.log( event );
    this.minCheckOutDate = event.value;
    console.log( this.minCheckOutDate );
  }
  myFilter ( d: any ) {
    this.minCheckOutDate = d;
    console.log( d );
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
}
