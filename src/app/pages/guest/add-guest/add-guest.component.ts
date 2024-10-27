import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddressComponent } from "../../../shared/address/address.component";
import { StayGuestComponent } from "../../../shared/stay-guest/stay-guest.component";
import { GuestService } from '../../../_services/guest.service';
import { GuestSiblingDetails } from '../../../models/sibling-details';
import { GuestBaseEntity } from '../../../models/guest-base';
import { PaymentDetailsComponent } from '../../../shared/payment-details/payment-details.component';
import { MoreGuestComponent } from "../../../shared/more-guest/more-guest.component";
import { CommonModule, DatePipe, formatDate, NgFor, SlicePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomMessageService } from '../../../_services/custom-message.service';
import { IdProofComponent } from "../../../shared/id-proof/id-proof.component";
import { saveAs } from "file-saver";
import { BookingDetails, GuestDetails, NewGuestDetails } from '../../../models/new-guest-details';
import { TooltipModule } from 'primeng/tooltip';
import { StorageService } from '../../../_services/storage.service';
import { ApiResponse } from '../../../models/response';
import { CamelCaseToSpacePipe } from '../../../_helpers/camelcasetospace';
import { UtilsService } from '../../../_helpers/utils.service';
import { BookingService } from '../../../_services/booking.service';
import { InvoiceService } from '../../../_services/invoice.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component( {
  selector: 'app-add-guest',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddressComponent,
    NgSelectModule,
    RouterLink,
    ConfirmDialogModule,
    ToastModule,
    PaymentDetailsComponent,
    StayGuestComponent,
    MoreGuestComponent,
    StepperModule,
    ButtonModule,
    RippleModule,
    NgFor,
    TooltipModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    SelectModule,
    CheckboxModule,
    NgxMaskDirective,
    IdProofComponent],
  templateUrl: './add-guest.component.html',
  styleUrl: './add-guest.component.css',
  providers: [DatePipe, ConfirmationService, MessageService, provideNgxMask()],
  encapsulation: ViewEncapsulation.None,

} )
export class AddGuestComponent implements OnInit, AfterContentChecked {
  onContinue ( $event: any ) {
    console.log( $event );
  }
  loading: boolean = false;
  gender = [
    { name: 'MALE', code: 'MALE' },
    { name: 'FEMALE', code: 'FEMALE' },
    { name: 'TRANSGENDER', code: 'TRANSGENDER' }

  ];
  isBookigDataSaved: boolean = false;
  hotelId: string = '5c953e70-73fe-46cf-0267-08dcb3aa275e';
  moreGuestForm: FormGroup;
  newGuestForm = this.formBuilder.group( {
    GuestId: new FormControl<string>( '' ),
    Company: new FormControl<string>( '' ),
    CompanyGSTIN: new FormControl<string>( '' ),
    CompanyAddress: new FormControl<string>( '' ),
    Comments: new FormControl<string>( '' ),
    Print_CD: new FormControl<boolean>( true ),
    Print_Comments: new FormControl<boolean>( true ),
    FirstName: new FormControl<string>( '', [Validators.required, Validators.minLength( 3 )] ),
    LastName: new FormControl<string>( '', [Validators.required, Validators.minLength( 3 )] ),
    MobileNo: new FormControl( '', [Validators.required, Validators.minLength( 10 )] ),
    EmailId: new FormControl<string>( '' ),
    Gender: new FormControl( 'MALE', [Validators.required] ),
    Address: new FormControl( '', [Validators.required, Validators.minLength( 3 )] ),
    CityId: new FormControl( null, [Validators.required] ),
    StateId: new FormControl( { value: "", disabled: true } ),
    CountryId: new FormControl( { value: "", disabled: true } ),
    PinCode: new FormControl( '' ),
    CheckInDate: new FormControl<string>( '', [Validators.required,
    Validators.pattern( /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} ([01][0-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/ )] ),
    CheckOutDate: new FormControl<string>( '', [Validators.required,
    Validators.pattern( /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} ([01][0-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/ )] ),
    RoomNoId: new FormControl( [] ),
    RoomId: new FormControl( [], [Validators.required] ),
    NoOfGuests: new FormControl<number>( 0 ),
    NoOfAdults: new FormControl<number>( 0, [Validators.required] ),
    NoOfChildren: new FormControl<number>( 0, [Validators.required] ),
    RatePerNight: new FormControl<number>( 0 ),
    Discount: new FormControl<number>( 0 ),
    TotalAmount: new FormControl<number>( 0 ),
    NoOfDays: new FormControl<number>( 0 ),
    AmountToPay: new FormControl<number>( 0 ),
    GSTPercentage: new FormControl<number>( 12 ),
    IncGST: new FormControl( 0 ),
    ExcGST: new FormControl( 0 ),
    CGST: new FormControl( 0 ),
    SGST: new FormControl( 0 ),
    UTGST: new FormControl( 0 ),
    IGST: new FormControl( 0 ),
    PaymentMode: new FormControl( 1, [Validators.required] ),
    AmountPaid: new FormControl<number>( 0, [Validators.required] ),
    BalanceAmount: new FormControl<number>( 0 ),
    TransactionNo: new FormControl<string>( '' ),
    IdType: new FormControl( "" ),
    IdNumber: new FormControl( "" ),
    ImageUrl: new FormControl( "" ),
    InvoiceNo: new FormControl( { value: "", disabled: true } ),
    IsFrontSide: new FormControl( false ),
    ManualInvoice: new FormControl( false ),
    // dateTimeInput: new FormControl( '', [
    //   Validators.required,
    //   this.validateDateTime()
    // ] ),
  },
    { validators: this.dateRangeValidator( 'CheckInDate', 'CheckOutDate' ) }
  );

  dateRangeValidator ( startControlName: string, endControlName: string ): ValidatorFn {
    return ( formGroup: AbstractControl ): { [key: string]: any; } | null => {
      const startControl = formGroup.get( startControlName );
      const endControl = formGroup.get( endControlName );
      if ( !startControl || !endControl ) {
        return null;
      }
      const startDate = startControl.value;
      const endDate = endControl.value;
      if ( startDate && endDate && startDate > endDate ) {
        return { dateRangeInvalid: true }; // Return an error object if the validation fails
      }
      return null; // Return null if the validation passes
    };
  }
  active: number | undefined = 0;
  savedGuest: GuestBaseEntity[] = [];

  constructor(
    @Inject( ActivatedRoute ) private route: ActivatedRoute,
    private guestService: GuestService,
    private bookingService: BookingService,
    @Inject( FormBuilder ) private fb: FormBuilder,
    @Inject( Router ) private router: Router,
    @Inject( FormBuilder ) private formBuilder: FormBuilder,
    @Inject( ChangeDetectorRef ) private cdref: ChangeDetectorRef,
    private datePipe: DatePipe,
    private customMessageService: CustomMessageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private utilsService: UtilsService,
    private invoiceService: InvoiceService,
    private storageService: StorageService ) {
    this.moreGuestForm = this.fb.group( {
      guests: this.fb.array( [] )
    } );
    this.moreGuestForm.setValidators( this.dateRangeValidator( 'CheckInDate', 'CheckOutDate' ) );
  }

  get guests () {
    return this.moreGuestForm.get( 'guests' ) as FormArray;
  }

  onManualInvoiceChange () {
    let mValue = this.newGuestForm.controls.ManualInvoice.value;
    console.log( mValue );
    if ( mValue )
      this.newGuestForm.controls.InvoiceNo.enable();
    else
      this.newGuestForm.controls.InvoiceNo.disable();
  }

  saveGuest () {
  }

  confirm ( event: any ) {
    this.confirmationService.confirm( {
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.router.navigateByUrl( '/guest/list' ).then( () => {
          this.messageService.add( { severity: 'info', summary: 'Confirmed', detail: 'Canceled' } );
        } );
      },
      reject: () => {
        this.messageService.add( { severity: 'error', summary: 'Rejected', detail: 'You have rejected' } );
      }
    } );
  }

  generateInvoice () {
    this.loading = true;
    this.guestService.generateInvoice( this.savedGuest[0].Id! ).subscribe( {
      next: ( result ) => {
        saveAs( result, `${ this.savedGuest[0].Id! }.pdf` );
      },
      error: ( err ) => {
        console.log( err );
      },
      complete: () => {
        this.loading = false;
      }
    } );
  }

  createGuest (): FormGroup {

    return this.fb.group( {
      FirstName: [''],
      LastName: [''],
      Gender: [null],
      Age: [''],
    } );
  }

  addGuest ( $event: any ) {
    $event.preventDefault();
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

  ngOnInit (): void {
    let storageData = this.storageService.getData( "auth-user" );
    if ( storageData != null || storageData != undefined ) {
      let resp = storageData as ApiResponse;
      if ( resp.Data != null || resp.Data != undefined ) {
        this.hotelId = resp.Data.HotelId;
      }
    }
    this.guestService.getNewInvoiceNo( this.hotelId ).subscribe( {
      next: ( resp ) => {
        this.newGuestForm.controls.InvoiceNo.setValue( resp.Data );
      },
      error: ( err ) => {
        console.log( err );
      },
      complete: () => {

      }
    } );
  }
  private camelCaseToSpacePipe = new CamelCaseToSpacePipe();
  onSubmit () {

  }
  private findInvalidControls (): string[] {
    const invalidControls: string[] = [];
    const controls = this.newGuestForm.controls;
    for ( const name in controls ) {
      if ( controls[name as keyof typeof controls].invalid ) {
        invalidControls.push( this.camelCaseToSpacePipe.transform( name.replace( "Id", "" ) ) );
      }
    }
    return invalidControls;
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
      Company: this.newGuestForm.controls.Company.value!,
      GSTIN: this.newGuestForm.controls.CompanyGSTIN.value!,
      CompanyAddress: this.newGuestForm.controls.CompanyAddress.value!,
      Comments: this.newGuestForm.controls.Comments.value!,
      Print_CD: this.newGuestForm.controls.Print_CD.value!,
      Print_Comments: this.newGuestForm.controls.Print_Comments.value!,
      // HotelId: "5c953e70-73fe-46cf-0267-08dcb3aa275e",
      HotelId: this.hotelId,
      CityId: this.newGuestForm.controls.CityId.value!,
      StateId: this.newGuestForm.controls.StateId.value!,
      CountryId: this.newGuestForm.controls.CountryId.value!,
      AmountPaid: this.newGuestForm.controls.AmountPaid.value!,
      AmountToPay: this.newGuestForm.controls.ExcGST.value!,
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
      // RoomNoId: [this.newGuestForm.controls.RoomNoId.value!],
      IdType: this.newGuestForm.controls.IdType.value!,
      IdNumber: this.newGuestForm.controls.IdNumber.value!,
      ImageUrl: this.newGuestForm.controls.ImageUrl.value!,
      IsFrontSide: true,
      ManualInvoice: Boolean( this.newGuestForm.controls.ManualInvoice.value ),
      TransactionNo: this.newGuestForm.controls.TransactionNo.value!,
      InvoiceNo: this.newGuestForm.controls.InvoiceNo.value!,
      // GuestId: this.newGuestForm.controls.PaymentMode.value!,
      GuestSiblingDetail: guestSiblings
    };
    this.guestService.saveGuest( guestDetail ).subscribe( {
      next: ( data ) => {
        this.messageService.add( { severity: 'success', summary: 'Saved', detail: 'Guest saved successfully' } );
        this.savedGuest.push( {
          Id: data.Data.Id,
          FL_Name: guestDetail.FirstName + ' ' + guestDetail.LastName
        } );
        console.log( 'Guest saved successfully', data );
        // this.router.navigate( ['admin/guest'] );
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
          this.customMessageService.sendMessage( true );
        } );
      }
    } );
  }

  onGuestSave () {
    console.log( this.newGuestForm.value );
    const invalidControls = this.utilsService.validateAndGetInvalidControls( this.newGuestForm, [
      'FirstName',
      'LastName',
      'Gender',
      'MobileNo',
      'Address',
      'CityId',
    ] );
    if ( invalidControls.length > 0 ) {
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    const guestDetails: GuestDetails = {
      Company: this.newGuestForm.controls.Company.value!,
      CompanyAddress: this.newGuestForm.controls.CompanyAddress.value!,
      GsTin: this.newGuestForm.controls.CompanyGSTIN.value!,
      FirstName: this.newGuestForm.controls.FirstName.value!,
      LastName: this.newGuestForm.controls.LastName.value!,
      Email: this.newGuestForm.controls.EmailId.value!,
      Gender: this.newGuestForm.controls.Gender.value!,
      MobileNo: this.newGuestForm.controls.MobileNo.value!,
      Address: this.newGuestForm.controls.Address.value!,
      CityId: this.newGuestForm.controls.CityId.value!,
      InvoiceNo: this.newGuestForm.controls.InvoiceNo.value!,
      IsManualInv: this.newGuestForm.controls.ManualInvoice.value!,
      Print_CD: this.newGuestForm.controls.Print_CD.value!,
      Comment: this.newGuestForm.controls.Comments.value!,
    };
    console.log( guestDetails );
    this.guestService.saveGuestDetails( guestDetails ).subscribe( {
      next: ( response ) => {
        console.log( response );
        if ( response.StatusCode == 200 ) {
          this.messageService.add( { severity: 'success', summary: 'Saved', detail: response.Message } );
          this.newGuestForm.controls.GuestId.patchValue( response.Data.Id );
        }
        if ( response.StatusCode == 9 )
          this.messageService.add( { severity: 'error', summary: 'Error', detail: `An error occurred while saving data` } );
      },
      error: ( err ) => {
        this.messageService.add( { severity: 'error', summary: 'Error', detail: `An error occurred while saving data - ${ err }` } );
        console.log( err );
      },
      complete: () => {
        console.log( this.newGuestForm.controls.GuestId.value );
      }
    } );
  }
  onSaveBooking ( event: any ) {
    const invalidControls = this.findInvalidControls();
    if ( invalidControls.length > 0 ) {
      // Handle the case where there are invalid controls
      console.error( 'Invalid controls:', invalidControls );
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    const bookingDetails: BookingDetails = {
      GuestId: this.newGuestForm.controls.GuestId.value!,
      CheckInDate: this.newGuestForm.controls.CheckInDate.value!,
      CheckOutDate: this.newGuestForm.controls.CheckOutDate.value!,
      Rooms: this.newGuestForm.controls.RoomId.value!,
      RatePerNight: this.newGuestForm.controls.RatePerNight.value!,
      TotalAmount: this.newGuestForm.controls.TotalAmount.value!,
      Discount: this.newGuestForm.controls.Discount.value!,
      NoOfDays: this.newGuestForm.controls.NoOfDays.value!,
      NoOfAdults: this.newGuestForm.controls.NoOfAdults.value!,
      NoOfChild: this.newGuestForm.controls.NoOfChildren.value!,
      NoOfGuests: this.newGuestForm.controls.NoOfGuests.value!,
      AmountIncludingGst: this.newGuestForm.controls.ExcGST.value!,
      AmountPaid: this.newGuestForm.controls.AmountPaid.value!,
      Balance: this.newGuestForm.controls.BalanceAmount.value!,
      PaymentMode: String( this.newGuestForm.controls.PaymentMode.value! ),
      TransactionNo: this.newGuestForm.controls.TransactionNo.value!,
      CGST: this.newGuestForm.controls.CGST.value!,
      SGST: this.newGuestForm.controls.CGST.value!,
      UTGST: this.newGuestForm.controls.CGST.value!,
      IGST: this.newGuestForm.controls.IGST.value!,
      InvoiceNo: this.newGuestForm.controls.InvoiceNo.value!,
      TotalDays: this.newGuestForm.controls.NoOfDays.value!,
    };
    console.log( bookingDetails );
    this.bookingService.saveBookingDetails( bookingDetails ).subscribe( {
      next: ( response ) => {
        if ( response.StatusCode == 200 ) {
          this.isBookigDataSaved = true;
          this.messageService.add( { severity: 'success', summary: 'Success', detail: `${ response.Message } with invoice no ${ this.newGuestForm.controls.InvoiceNo.value! }` } );
        }
        if ( response.StatusCode == 400 ) {
          this.isBookigDataSaved = true;
          this.messageService.add( { severity: 'error', summary: 'Error', detail: `An error occured while saving and generating invoice.` } );
        }
      },
      error: ( err ) => {
        console.log( err );
      },
      complete: () => {
        // this.newGuestForm.reset();
      }

    } );

  }
  onInvoiceClick ( id: string, invoiceNo?: string ) {

    this.invoiceService.generateInvoice( id, invoiceNo ).subscribe( {
      next: ( response ) => {
        saveAs( response, `${ id }.pdf` );
      },
      error: ( error ) => {
        console.log( error );
      }
    } );
  }
  ngAfterContentChecked () {
    this.cdref.detectChanges();
  }
  activeIndex: number = 0;
  previousIndex: number = 0;
  // Method to handle the step change event
  onStepChange ( event: any ) {
    const stepIndex = event.index; // Get the current step index
    console.log( 'Step changed to:', stepIndex );

    // You can perform any local actions you want here without emitting data
    this.handleStepChangeLocally( stepIndex );
  }

  // Local method to handle step changes without server interaction
  handleStepChangeLocally ( stepIndex: number ) {
    // Perform any local logic depending on the current step
    if ( stepIndex === 0 ) {
      console.log( 'Handling step 1' );
    } else if ( stepIndex === 1 ) {
      console.log( 'Handling step 2' );
    } else if ( stepIndex === 2 ) {
      console.log( 'Handling step 3' );
    }

    // No HTTP request made here, just handling logic locally
  }
}

