import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomMessageService } from '../../../_services/custom-message.service';
import { MoreGuestComponent } from "../../../shared/more-guest/more-guest.component";
import { StayGuestComponent } from "../../../shared/stay-guest/stay-guest.component";
import { AddressComponent } from "../../../shared/address/address.component";
import { PaymentDetailsComponent } from '../../../shared/payment-details/payment-details.component';
import { IdProofComponent } from "../../../shared/id-proof/id-proof.component";
import { GuestBaseEntity } from '../../../models/guest-base';
import { GuestService } from '../../../_services/guest.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { GuestSiblingDetails } from '../../../models/sibling-details';
import { TableModule } from 'primeng/table';
import { Guest } from '../../../models/guest';
import { NewGuestDetails } from '../../../models/new-guest-details';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../_services/storage.service';
import { ApiResponse } from '../../../models/response';
import saveAs from 'file-saver';
import { GuestStayDetail } from '../../../models/guest_stay_detail';
import { CheckboxModule } from 'primeng/checkbox';
@Component( {
  selector: 'app-edit-guest',
  standalone: true,
  imports: [
    CommonModule,
    StepperModule,
    TooltipModule,
    TableModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule,
    NgSelectModule,
    MoreGuestComponent,
    StayGuestComponent,
    AddressComponent,
    PaymentDetailsComponent,
    IdProofComponent,
    CheckboxModule
  ],
  templateUrl: './edit-guest.component.html',
  styleUrl: './edit-guest.component.css',
  providers: [DatePipe, ConfirmationService, MessageService]
} )
export class EditGuestComponent implements OnInit, AfterContentChecked {
  loading: unknown;
  savedGuest!: GuestBaseEntity[];
  constructor(
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    private guestService: GuestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private customMessageService: CustomMessageService,
    private guetsService: GuestService,
    private router: Router,
    private datePipe: DatePipe,
    private storageService: StorageService
  ) {
    this.moreGuestForm = this.formBuilder.group( {
      guests: this.formBuilder.array( [] )
    } );
  }
  members!: GuestSiblingDetails[];
  hotelId: string = '5c953e70-73fe-46cf-0267-08dcb3aa275e';
  guestId: string = '';
  ngOnInit (): void {

    this.route.params.subscribe( param => {
      this.guestId = param["guest-id"];
    } );
    let storageData = this.storageService.getData( "auth-user" );
    if ( storageData != null || storageData != undefined ) {
      let resp = storageData as ApiResponse;
      if ( resp.Data != null || resp.Data != undefined ) {
        this.hotelId = resp.Data.HotelId;
      }
    }
    this.route.params.pipe(
      switchMap( ( params: Params ) => this.guetsService.getDetailsByGuestId( params['guest-id'] ) )
    ).subscribe( {
      next: ( result ) => {
        this.editGuestForm.controls.PaymentDetailsId.setValue( result.Data.PaymentDetailsId );
        this.editGuestForm.controls.Company.setValue( result.Data.Company );
        this.editGuestForm.controls.CompanyAddress.setValue( result.Data.CompanyAddress );
        this.editGuestForm.controls.CompanyGSTIN.setValue( result.Data.GSTIN );
        this.editGuestForm.controls.FirstName.setValue( result.Data.FirstName );
        this.editGuestForm.controls.LastName.setValue( result.Data.LastName );
        this.editGuestForm.controls.EmailId.setValue( result.Data.EmailId );
        this.editGuestForm.controls.Gender.setValue( result.Data.Gender );
        this.editGuestForm.controls.MobileNo.setValue( result.Data.MobileNo );
        this.editGuestForm.controls.Address.setValue( result.Data.Address );
        this.editGuestForm.controls.CityId.setValue( result.Data.CityId );
        this.editGuestForm.controls.StateId.setValue( result.Data.StateId );
        this.editGuestForm.controls.CountryId.setValue( result.Data.CountryId );
        this.editGuestForm.controls.PinCode.setValue( result.Data.PinCode );
        this.editGuestForm.controls.CheckInDate = new FormControl( new Date( result.Data.CheckInDate ) );
        this.editGuestForm.controls.CheckOutDate = new FormControl( new Date( result.Data.CheckOutDate ) );
        this.editGuestForm.controls.RoomNoId.setValue( result.Data.RoomNoId );
        this.editGuestForm.controls.TotalAmount.setValue( result.Data.AmountToPay );
        this.editGuestForm.controls.NoOfGuests.setValue( result.Data.NoOfGuests );
        this.editGuestForm.controls.NoOfDays.setValue( result.Data.NoOfDays );
        this.editGuestForm.controls.NoOfChildren.setValue( result.Data.NoOfChildren );
        this.editGuestForm.controls.NoOfAdults.setValue( result.Data.NoOfAdults );
        this.editGuestForm.controls.RatePerNight.setValue( result.Data.RatePerNight );
        this.editGuestForm.controls.Discount.setValue( result.Data.Discount );

        this.editGuestForm.controls.PaymentMode.setValue( result.Data.PaymentMode );
        this.editGuestForm.controls.TransactionNo.setValue( result.Data.TransactionNo );
        this.editGuestForm.controls.ExcGST.setValue( result.Data.ExcGST );
        this.editGuestForm.controls.IncGST.setValue( result.Data.IncGST );
        this.editGuestForm.controls.AmountPaid.setValue( result.Data.AmountPaid );
        this.editGuestForm.controls.BalanceAmount.setValue( result.Data.BalanceAmount );
        this.editGuestForm.controls.GuestStayDetailId.setValue( result.Data.GuestStayDetailId );
        this.editGuestForm.controls.InvoiceNo.setValue( result.Data.InvoiceNo );
        this.editGuestForm.controls.ManualInvoice.setValue( result.Data.ManualInvoice );
        this.members = result.Data.GuestSiblingDetail;
        this.fillMoreGuests( result.Data.GuestSiblingDetail );
        // this.toasterService.success('Country updated successfully.', 'Success');
      },
      error: ( result ) => {
        console.error( 'Error fetching room details', result );
      }
    } );
  }
  editGuestForm = this.formBuilder.group( {
    Company: new FormControl<string>( '' ),
    CompanyGSTIN: new FormControl<string>( '' ),
    CompanyAddress: new FormControl<string>( '' ),
    Comments: new FormControl<string>( '' ),
    Print_CD: new FormControl<boolean>( true ),
    Print_Comments: new FormControl<boolean>( true ),
    FirstName: new FormControl( '', [Validators.required] ),
    LastName: new FormControl( '', [Validators.required] ),
    MobileNo: new FormControl( '', [Validators.required] ),
    EmailId: new FormControl( '' ),
    Gender: new FormControl( null, [Validators.required] ),
    Address: new FormControl( '', [Validators.required] ),
    CityId: new FormControl( null, [Validators.required] ),
    StateId: new FormControl( null, [Validators.required] ),
    CountryId: new FormControl( null, [Validators.required] ),
    PinCode: new FormControl( '' ),
    GuestId: new FormControl( null ),
    CheckInDate: new FormControl<Date | null>( null, [Validators.required] ),
    CheckOutDate: new FormControl<Date | null>( null, [Validators.required] ),
    RoomNoId: new FormControl( null, [Validators.required] ),
    NoOfGuests: new FormControl<number>( 0, [Validators.required] ),
    NoOfAdults: new FormControl<number>( 0, [Validators.required] ),
    NoOfChildren: new FormControl<number>( 0, [Validators.required] ),
    RatePerNight: new FormControl<number>( 0 ),
    Discount: new FormControl<number>( 0 ),
    TotalAmount: new FormControl<number>( 0, [Validators.required] ),
    NoOfDays: new FormControl<number>( 0 ),
    AmountToPay: new FormControl<number>( 0 ),
    GSTPercentage: new FormControl<number>( 12 ),
    IncGST: new FormControl( 0 ),
    ExcGST: new FormControl( 0 ),
    CGST: new FormControl( 0 ),
    SGST: new FormControl( 0 ),
    UTGST: new FormControl( 0 ),
    IGST: new FormControl( 0 ),
    PaymentMode: new FormControl( null, [Validators.required] ),
    AmountPaid: new FormControl<number>( 0, [Validators.required] ),
    BalanceAmount: new FormControl<number>( 0 ),
    TransactionNo: new FormControl<string>( '' ),
    IdType: new FormControl( "" ),
    IdNumber: new FormControl( "" ),
    ImageUrl: new FormControl( "" ),
    IsFrontSide: new FormControl( false ),
    GuestStayDetailId: new FormControl( '' ),
    InvoiceNo: new FormControl( { value: "", disabled: true } ),
    ManualInvoice: new FormControl( { value: false, disabled: true } ),
    PaymentDetailsId: new FormControl( '' )
  } );
  fillMoreGuests ( siblingDetails: GuestSiblingDetails[] ) {

    for ( let index = 0; index < siblingDetails.length; index++ ) {
      const element = siblingDetails[index];
      const guestF = new FormGroup( {
        Id: new FormControl( '' ),
        GuestId: new FormControl( '' ),
        FirstName: new FormControl( '' ),
        LastName: new FormControl( '' ),
        Gender: new FormControl( '' ),
        Age: new FormControl( '' ),
      } );
      const createGuest = this.formBuilder.group( {
        Id: [element.Id],
        GuestId: [element.GuestId],
        FirstName: [element.FirstName],
        LastName: [element.LastName],
        Gender: [element.Gender],
        Age: [element.Age],
      } );
      this.guests.push( createGuest );
    }
    this.customMessageService.sendNoOfGuests( this.guests.length );
  }
  ngAfterContentChecked (): void {
    this.cdref.detectChanges();
  }
  generateInvoice () {
    this.loading = true;
    this.guestService.generateInvoice( this.guestId ).subscribe( {
      next: ( result ) => {
        saveAs( result, `${ this.guestId }.pdf` );
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
  get guests () {
    return this.moreGuestForm.get( 'guests' ) as FormArray;
  }
  createGuest (): FormGroup {
    return this.formBuilder.group( {
      Id: [''],
      GuestId: [''],
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
    this.customMessageService.sendNoOfGuests( this.guests.length );
    // this.guestForm.controls.GuestStayDetail.controls.TotalAmount.patchValue( this.guests.length );
    console.log( this.guests.length );
  }
  removeUser ( index: number ) {
    this.guests.removeAt( index );
    this.customMessageService.clearNoOfGuests();
    this.customMessageService.sendNoOfGuests( this.guests.length );
  }
  active: number | undefined = 0;
  confirm ( $event: MouseEvent ) {
    this.confirmationService.confirm( {
      target: $event.target as EventTarget,
      message: 'Do you want to cancel update?',
      header: 'Cancel Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.router.navigateByUrl( '/admin/guest/list' ).then( () => {
          this.messageService.add( { severity: 'info', summary: 'Confirmed', detail: 'Canceled' } );
        } );
      },
      reject: () => {
        this.messageService.add( { severity: 'error', summary: 'Rejected', detail: 'You have rejected' } );
      }
    } );
  }
  onUpdate () {
    if ( this.editGuestForm.invalid )
      this.toastrService.error( 'Please enter a valid data.' );
    else {
      this.updateGuest();
    }
  }
  onSubmit () {
    throw new Error( 'Method not implemented.' );
  }
  updateGuest () {
    if ( this.guestId == "" ) {
      this.toastrService.error( "Invalid data to update.", "Invalid Guest Error" );
      return;
    }
    const siblingDetails = this.moreGuestForm.get( 'guests' ) as FormArray;
    let guestSiblings: GuestSiblingDetails[] = [];
    for ( var c of siblingDetails.controls ) {
      guestSiblings.push( {
        Id: c.get( "Id" )?.value,
        GuestId: this.guestId,
        FirstName: c.get( "FirstName" )?.value!,
        LastName: c.get( "LastName" )?.value!,
        Gender: c.get( "Gender" )?.value!,
        Age: c.get( "Age" )?.value!,
      } );
    }

    let guestDetail: NewGuestDetails = {
      GuestStayDetailId: this.editGuestForm.controls.GuestStayDetailId.value!,
      PaymentDetailsId: this.editGuestForm.controls.PaymentDetailsId.value!,
      FirstName: this.editGuestForm.controls.FirstName.value!,
      LastName: this.editGuestForm.controls.LastName.value!,
      Gender: this.editGuestForm.controls.Gender.value!,
      PinCode: this.editGuestForm.controls.PinCode.value!,
      EmailId: this.editGuestForm.controls.EmailId.value!,
      MobileNo: this.editGuestForm.controls.MobileNo.value!,
      Address: this.editGuestForm.controls.Address.value!,
      Company: this.editGuestForm.controls.Company.value!,
      CompanyAddress: this.editGuestForm.controls.CompanyAddress.value!,
      GSTIN: this.editGuestForm.controls.CompanyGSTIN.value!,
      Comments: this.editGuestForm.controls.Comments.value!,
      Print_CD: this.editGuestForm.controls.Print_CD.value!,
      Print_Comments: this.editGuestForm.controls.Print_Comments.value!,
      HotelId: this.hotelId,
      CityId: this.editGuestForm.controls.CityId.value!,
      StateId: this.editGuestForm.controls.StateId.value!,
      CountryId: this.editGuestForm.controls.CountryId.value!,
      AmountPaid: this.editGuestForm.controls.AmountPaid.value!,
      AmountToPay: this.editGuestForm.controls.ExcGST.value!,
      BalanceAmount: this.editGuestForm.controls.BalanceAmount.value!,
      CheckInDate: this.datePipe.transform( this.editGuestForm.controls.CheckInDate.value!, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      CheckOutDate: this.datePipe.transform( this.editGuestForm.controls.CheckOutDate.value!, 'yyyy-MM-dd hh:mm:ss a' )!.toString(),
      Discount: this.editGuestForm.controls.Discount.value!,
      ExcGST: this.editGuestForm.controls.ExcGST.value!,
      GSTPercentage: this.editGuestForm.controls.GSTPercentage.value!,
      IncGST: this.editGuestForm.controls.IncGST.value!,
      NoOfAdults: this.editGuestForm.controls.NoOfAdults.value!,
      NoOfChildren: this.editGuestForm.controls.NoOfChildren.value!,
      NoOfDays: this.editGuestForm.controls.NoOfDays.value!,
      NoOfGuests: this.editGuestForm.controls.NoOfGuests.value!,
      PaymentMode: String( this.editGuestForm.controls.PaymentMode.value! ),
      // RatePerNight: this.editGuestForm.controls.RatePerNight.value!,
      RatePerNight: this.editGuestForm.controls.RatePerNight.value!,
      RoomNoId: this.editGuestForm.controls.RoomNoId.value!,
      IdType: this.editGuestForm.controls.IdType.value!,
      IdNumber: this.editGuestForm.controls.IdNumber.value!,
      ImageUrl: this.editGuestForm.controls.ImageUrl.value!,
      IsFrontSide: true,
      TransactionNo: this.editGuestForm.controls.TransactionNo.value!,
      InvoiceNo: this.editGuestForm.controls.InvoiceNo.value!,
      ManualInvoice: Boolean( this.editGuestForm.controls.InvoiceNo.value! ),
      GuestId: this.guestId,
      GuestSiblingDetail: guestSiblings
    };
    console.log( guestDetail );
    this.guestService.updateGuest( guestDetail ).subscribe( {
      next: ( data ) => {
        this.toastrService.success( data.Message, 'Success' );
        this.savedGuest.push( {
          Id: data.Data.Id,
          FL_Name: guestDetail.FirstName + ' ' + guestDetail.LastName
        } );
        // this.router.navigate( ['admin/guest'] );
      },
      error: ( error ) => {
        console.error( 'Error saving guest', error );
      }
    } );
  }
}
