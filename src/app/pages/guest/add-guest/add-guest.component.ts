import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressComponent } from "../../../shared/address/address.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { StayGuestComponent } from "../../../shared/stay-guest/stay-guest.component";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { IonicModule } from '@ionic/angular';
import { TooltipDirective } from '../../../_directives/tooltip.directive';
import { GuestService } from '../../../_services/guest.service';
import { GuestPersonalDetail } from '../../../models/guest-pd';
import { GuestSiblingDetails } from '../../../models/sibling-details';
import { ToastrService } from 'ngx-toastr';
import { GuestBaseEntity } from '../../../models/guest-base';
import { PaymentDetailsComponent } from '../../../shared/payment-details/payment-details.component';
import { MoreGuestComponent } from "../../../shared/more-guest/more-guest.component";
import { CommonModule, DatePipe, NgFor, SlicePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../_services/message.service';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { IdProofComponent } from "../../../shared/id-proof/id-proof.component";
import { saveAs } from "file-saver";
import { RippleModule } from 'primeng/ripple';
import { NewGuestDetails } from '../../../models/new-guest-details';
@Component( {
  selector: 'app-add-guest',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddressComponent,
    NgSelectModule,
    BsDatepickerModule,
    IonicModule,
    TooltipDirective,
    PaymentDetailsComponent,
    StayGuestComponent,
    MoreGuestComponent,
    StepperModule,
    ButtonModule,
    RippleModule,
    NgFor,
    IdProofComponent],
  templateUrl: './add-guest.component.html',
  styleUrl: './add-guest.component.css',
  providers: [DatePipe]
} )
export class AddGuestComponent implements OnInit, AfterContentChecked {
  loading: boolean = false;
  saveGuest () {

  }
  generateInvoice () {
    this.loading = true;
    this.guestService.generateInvoice( this.savedGuest[0].Id! ).subscribe( {
      next: ( result ) => {
        saveAs( result, 'abc.pdf' );
      },
      error: ( err ) => {
        console.log( err );
      },
      complete: () => {
        this.loading = false;
      }
    } );
  }
  moreGuestForm: FormGroup;
  newGuestForm = this.formBuilder.group( {
    FirstName: new FormControl( '', [Validators.required] ),
    LastName: new FormControl( '', [Validators.required] ),
    MobileNo: new FormControl( '', [Validators.required] ),
    EmailId: new FormControl( '' ),
    Gender: new FormControl( null, [Validators.required] ),
    Address: new FormControl( '', [Validators.required] ),
    CityId: new FormControl( null, [Validators.required] ),
    StateId: new FormControl( null, [Validators.required] ),
    CountryId: new FormControl( null, [Validators.required] ),
    PinCode: new FormControl( '', [Validators.required] ),
    GuestId: new FormControl( null ),
    CheckInDate: new FormControl<string>( '', [Validators.required] ),
    CheckOutDate: new FormControl<string>( '', [Validators.required] ),
    RoomNoId: new FormControl( null, [Validators.required] ),
    NoOfGuests: new FormControl<number>( { value: 1, disabled: true }, [Validators.required] ),
    NoOfAdults: new FormControl<number>( 0, [Validators.required] ),
    NoOfChildren: new FormControl<number>( 0, [Validators.required] ),
    RatePerNight: new FormControl<number>( { value: 0, disabled: true } ),
    Discount: new FormControl<number>( { value: 0, disabled: true } ),
    TotalAmount: new FormControl<number>( { value: 0, disabled: true }, [Validators.required] ),
    NoOfDays: new FormControl<number>( { value: 0, disabled: true } ),
    AmountToPay: new FormControl<number>( { value: 0, disabled: true } ),
    GSTPercentage: new FormControl<number>( { value: 18, disabled: true } ),
    IncGST: new FormControl( 0 ),
    ExcGST: new FormControl( 0 ),
    PaymentMode: new FormControl( null, [Validators.required] ),
    AmountPaid: new FormControl<number>( 0, [Validators.required] ),
    BalanceAmount: new FormControl<number>( { value: 0, disabled: true }, [Validators.required] ),
    TransactionNo: new FormControl<string>( { value: '', disabled: true }, [Validators.required] ),
    IdType: new FormControl( "" ),
    IdNumber: new FormControl( "" ),
    ImageUrl: new FormControl( "" ),
    IsFrontSide: new FormControl( false ),
  } );
  constructor(
    private route: ActivatedRoute,
    private guestService: GuestService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    private datePipe: DatePipe,
    private messageService: MessageService ) {
    this.moreGuestForm = this.fb.group( {
      guests: this.fb.array( [] )
    } );
  }
  active: number | undefined = 0;

  get guests () {
    return this.moreGuestForm.get( 'guests' ) as FormArray;
  }
  createGuest (): FormGroup {

    return this.fb.group( {
      FirstName: [''],
      LastName: [''],
      Gender: [null],
      Age: [''],
    } );
  }
  addGuest () {
    const guestF = new FormGroup( {
      FirstName: new FormControl( '' ),
      LastName: new FormControl( '' ),
    } );
    this.guests.push( this.createGuest() );
    this.messageService.sendNoOfGuests( this.guests.length );
    // this.guestForm.controls.GuestStayDetail.controls.TotalAmount.patchValue( this.guests.length );
    console.log( this.guests.length );
  }
  removeUser ( index: number ) {
    this.guests.removeAt( index );
    this.messageService.clearNoOfGuests();
    this.messageService.sendNoOfGuests( this.guests.length );
  }
  ngOnInit (): void {
  }


  savedGuest: GuestBaseEntity[] = [];
  onSubmit () {
    if ( this.newGuestForm.invalid )
      this.toastrService.error( 'Please enter a valid data.' );
    else {
      this.submitGuest();
    }
  }
  submitGuest () {
    const siblingDetails = this.moreGuestForm.get( 'guests' ) as FormArray;
    let guestSiblings: GuestSiblingDetails[] = [];
    for ( var c of siblingDetails.controls ) {
      guestSiblings.push( {
        FirstName: c.get( "FirstName" )?.value!,
        LastName: c.get( "LastName" )?.value!,
        Gender: c.get( "Gender" )?.value!,
        Age: c.get( "Age" )?.value!,
      } );
    }
    let guestDetail: NewGuestDetails = {
      FirstName: this.newGuestForm.controls.FirstName.value!,
      LastName: this.newGuestForm.controls.LastName.value!,
      Gender: this.newGuestForm.controls.Gender.value!,
      PinCode: this.newGuestForm.controls.PinCode.value!,
      EmailId: this.newGuestForm.controls.EmailId.value!,
      MobileNo: this.newGuestForm.controls.MobileNo.value!,
      Address: this.newGuestForm.controls.Address.value!,
      HotelId: "5c953e70-73fe-46cf-0267-08dcb3aa275e",
      CityId: this.newGuestForm.controls.CityId.value!,
      StateId: this.newGuestForm.controls.StateId.value!,
      CountryId: this.newGuestForm.controls.CountryId.value!,
      AmountPaid: this.newGuestForm.controls.AmountPaid.value!,
      AmountToPay: this.newGuestForm.controls.AmountToPay.value!,
      BalanceAmount: this.newGuestForm.controls.BalanceAmount.value!,
      CheckInDate: this.datePipe.transform( this.newGuestForm.controls.CheckInDate.value!, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      CheckOutDate: this.datePipe.transform( this.newGuestForm.controls.CheckOutDate.value!, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      Discount: this.newGuestForm.controls.Discount.value!,
      ExcGST: this.newGuestForm.controls.ExcGST.value!,
      GSTPercentage: this.newGuestForm.controls.GSTPercentage.value!,
      IncGST: this.newGuestForm.controls.IncGST.value!,
      NoOfAdults: this.newGuestForm.controls.NoOfAdults.value!,
      NoOfChildren: this.newGuestForm.controls.NoOfChildren.value!,
      NoOfDays: this.newGuestForm.controls.NoOfDays.value!,
      NoOfGuests: this.newGuestForm.controls.NoOfGuests.value!,
      PaymentMode: String( this.newGuestForm.controls.PaymentMode.value! ),
      RatePerNight: this.newGuestForm.controls.RatePerNight.value!,
      RoomNoId: this.newGuestForm.controls.RoomNoId.value!,
      IdType: this.newGuestForm.controls.IdType.value!,
      IdNumber: this.newGuestForm.controls.IdNumber.value!,
      ImageUrl: this.newGuestForm.controls.ImageUrl.value!,
      IsFrontSide: true,
      TransactionNo: this.newGuestForm.controls.TransactionNo.value!,
      // GuestId: this.newGuestForm.controls.PaymentMode.value!,
      GuestSiblingDetail: guestSiblings
    };
    this.guestService.saveGuest( guestDetail ).subscribe( {
      next: ( data ) => {
        this.toastrService.success( data.Message, 'Success' );
        this.savedGuest.push( {
          Id: data.Data.Id,
          FL_Name: guestDetail.FirstName + ' ' + guestDetail.LastName
        } );
        console.log( 'Guest saved successfully', data );
        this.router.navigate( ['admin/guest'] );
      },
      error: ( error ) => {
        console.error( 'Error saving guest', error );
      }
    } );

  }
  onClose () {
    this.guestService.getAllGuest().subscribe( {
      next: ( result ) => {
        this.router.navigate( ['admin/guest'] ).then( ( resolve ) => {
          this.messageService.sendMessage( true );
        } );
      }
    } );

    // this.router.navigate( ['admin/guest'] );

  }
  ngAfterContentChecked () {

    this.cdref.detectChanges();

  }
}
