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
  newGuestForm!: FormGroup;
  ContactDetails!: FormGroup;
  isGuestDataSaved: Boolean = false;
  isStayDetailsSaved: Boolean = false;

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
    this.newGuestForm = this.formBuilder.group( {
      GuestId: new FormControl<string>( '' ),
      Company: new FormControl<string>( '' ),
      CompanyGSTIN: new FormControl<string>( '' ),
      CompanyAddress: new FormControl<string>( '' ),
      FirstName: new FormControl<string>( '', [Validators.required, Validators.minLength( 3 )] ),
      LastName: new FormControl<string>( '', [Validators.required, Validators.minLength( 3 )] ),
      MobileNo: new FormControl( '', [Validators.required, Validators.minLength( 10 )] ),
      EmailId: new FormControl<string>( '' ),
      Gender: new FormControl( 'MALE', [Validators.required] ),
      ContactDetails: this.formBuilder.group( {
        GuestId: new FormControl<string>( '' ),
        Address: new FormControl( '', [Validators.required, Validators.minLength( 3 )] ),
        CityId: new FormControl( null, [Validators.required] ),
        StateId: new FormControl( { value: "", disabled: true } ),
        CountryId: new FormControl( { value: "", disabled: true } ),
        PinCode: new FormControl( '' ),
      } ),
      StayDetails: this.formBuilder.group( {
        GuestId: new FormControl<string>( '' ),
        CheckInDate: new FormControl( null, [Validators.required] ),
        CheckOutDate: new FormControl( null, [Validators.required] ),
        RoomNoId: new FormControl( [] ),
        RoomId: new FormControl( [], [Validators.required] ),
        NoOfGuests: new FormControl<number>( 0 ),
        NoOfAdults: new FormControl<number>( 0, [Validators.required] ),
        NoOfChildren: new FormControl<number>( 0, [Validators.required] ),
        RatePerNight: new FormControl<number>( 0 ),
        Discount: new FormControl<number>( 0 ),
        TotalAmount: new FormControl<number>( 0 ),
        NoOfDays: new FormControl<number>( 0 ),
        AmountPaid: new FormControl<number>( 0 ),
      } ),
      PaymentDetails: this.formBuilder.group( {
        PaymentDetailsId: new FormControl( '' ),
        GuestId: new FormControl<string>( '' ),
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
        PaymentDate: new FormControl( new Date(), [Validators.required] ),
      } ),
      InvoiceNo: new FormControl( { value: "", disabled: true } ),
      ManualInvoice: new FormControl( false ),
      Comments: new FormControl<string>( '' ),
      Print_CD: new FormControl<boolean>( true ),
      Print_Comments: new FormControl<boolean>( true ),
    },
      { validators: this.dateRangeValidator( 'CheckInDate', 'CheckOutDate' ) }
    );

  }

  get guests () {
    return this.moreGuestForm.get( 'guests' ) as FormArray;
  }

  onManualInvoiceChange () {
    let mValue = this.newGuestForm.controls['ManualInvoice'].value;

    if ( mValue )
      this.newGuestForm.controls['InvoiceNo'].enable();
    else
      this.newGuestForm.controls['InvoiceNo'].disable();
  }
  get contactDetailsFormGroup (): FormGroup {
    return this.newGuestForm.get( 'ContactDetails' ) as FormGroup;
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
    this.invoiceService.generateInvoice( this.savedGuest[0].Id! ).subscribe( {
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

  }

  removeUser ( index: number ) {
    this.guests.removeAt( index );
    this.customMessageService.clearNoOfGuests();
    this.customMessageService.sendNoOfGuests( this.guests.length );
  }
  get stayDetailsFormGroup (): FormGroup {

    return this.newGuestForm.get( 'StayDetails' ) as FormGroup;
  }
  get paymentDetailsFormGroup (): FormGroup {
    return this.newGuestForm.get( 'PaymentDetails' ) as FormGroup;
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
        this.newGuestForm.controls['InvoiceNo'].setValue( resp.Data.invoiceNo );
        console.log( resp.Data );
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


  onGuestSave () {

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
    console.log( this.newGuestForm.controls['Gender'].value );
    const guestDetails: GuestDetails = {
      Company: this.newGuestForm.controls['Company'].value!,
      CompanyAddress: this.newGuestForm.controls['CompanyAddress'].value!,
      GsTin: this.newGuestForm.controls['CompanyGSTIN'].value!,
      FirstName: this.newGuestForm.controls['FirstName'].value!,
      LastName: this.newGuestForm.controls['LastName'].value!,
      Email: this.newGuestForm.controls['EmailId'].value!,
      Gender: this.newGuestForm.controls['Gender'].value!,
      MobileNo: this.newGuestForm.controls['MobileNo'].value!,
      Address: this.contactDetailsFormGroup.controls['Address'].value!,
      CityId: this.contactDetailsFormGroup.controls['CityId'].value!,
      PinCode: this.contactDetailsFormGroup.controls['PinCode'].value,
      InvoiceNo: this.newGuestForm.controls['InvoiceNo'].value!,
      IsManualInv: this.newGuestForm.controls['ManualInvoice'].value!,
      Print_CD: this.newGuestForm.controls['Print_CD'].value!,
      Comment: this.newGuestForm.controls['Comments'].value!,
    };

    this.guestService.saveGuestDetails( guestDetails ).subscribe( {
      next: ( response ) => {

        if ( response.StatusCode == 200 ) {
          this.messageService.add( { severity: 'success', summary: 'Saved', detail: response.Message } );
          this.newGuestForm.controls['GuestId'].patchValue( response.Data.Id );
          this.isGuestDataSaved = true;
          return;
        }
        if ( response.StatusCode == 9 )
          this.messageService.add( { severity: 'error', summary: 'Error', detail: `An error occurred while saving data` } );
      },
      error: ( err ) => {
        this.messageService.add( { severity: 'error', summary: 'Error', detail: `An error occurred while saving data - ${ err }` } );
        console.log( err );
        this.isGuestDataSaved = false;
      },
      complete: () => {

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
      GuestId: this.newGuestForm.controls['GuestId'].value!,
      // CheckInDate: this.datePipe.transform( this.stayDetailsFormGroup.controls['CheckInDate']?.value!, 'dd/MM/yyyy hh:mm a' )!.toString(),
      // CheckOutDate: this.datePipe.transform( this.stayDetailsFormGroup.controls['CheckOutDate']?.value!, 'dd/MM/yyyy hh:mm a' )!.toString(),
      CheckInDate: this.stayDetailsFormGroup.controls['CheckInDate']?.value!,
      CheckOutDate: this.stayDetailsFormGroup.controls['CheckOutDate']?.value!,
      Rooms: this.stayDetailsFormGroup.controls['RoomId'].value!,
      RatePerNight: this.stayDetailsFormGroup.controls['RatePerNight'].value!,
      TotalAmount: this.stayDetailsFormGroup.controls['TotalAmount'].value!,
      Discount: this.stayDetailsFormGroup.controls['Discount'].value!,
      NoOfDays: this.stayDetailsFormGroup.controls['NoOfDays'].value!,
      NoOfAdults: this.stayDetailsFormGroup.controls['NoOfAdults'].value!,
      NoOfChild: this.stayDetailsFormGroup.controls['NoOfChildren'].value!,
      NoOfGuests: this.stayDetailsFormGroup.controls['NoOfGuests'].value!,
      AmountIncludingGst: this.paymentDetailsFormGroup.controls['ExcGST'].value!,
      AmountPaid: this.paymentDetailsFormGroup.controls['AmountPaid'].value!,
      Balance: this.paymentDetailsFormGroup.controls['BalanceAmount'].value!,
      PaymentMode: String( this.paymentDetailsFormGroup.controls['PaymentMode'].value! ),
      TransactionNo: this.paymentDetailsFormGroup.controls['TransactionNo'].value!,
      CGST: this.paymentDetailsFormGroup.controls['CGST'].value!,
      SGST: this.paymentDetailsFormGroup.controls['CGST'].value!,
      UTGST: this.paymentDetailsFormGroup.controls['CGST'].value!,
      IGST: this.paymentDetailsFormGroup.controls['IGST'].value!,
      InvoiceNo: this.newGuestForm.controls['InvoiceNo'].value!,
      TotalDays: this.stayDetailsFormGroup.controls['NoOfDays'].value!,
    };

    this.bookingService.saveBookingDetails( bookingDetails ).subscribe( {
      next: ( response ) => {
        if ( response.StatusCode == 200 ) {
          this.isBookigDataSaved = true;
          this.isStayDetailsSaved = true;
          this.messageService.add( { severity: 'success', summary: 'Success', detail: `${ response.Message } with invoice no ${ this.newGuestForm.controls['InvoiceNo'].value! }` } );
          return;
        }
        if ( response.StatusCode == 400 ) {
          this.isBookigDataSaved = true;
          this.messageService.add( { severity: 'error', summary: 'Error', detail: `An error occured while saving and generating invoice.` } );
          this.isStayDetailsSaved = false;
        }
      },
      error: ( err ) => {
        console.log( err );
        this.isStayDetailsSaved = false;
      },
      complete: () => {
        if ( this.isStayDetailsSaved ) {
          this.newGuestForm.reset();
          this.isGuestDataSaved = false;
          this.isStayDetailsSaved = false;
        }
      }

    } );

  }
  onInvoiceClick ( id: string, invoiceNo?: string ) {
    if ( id === '' || invoiceNo === '' ) {
      this.messageService.add( { severity: 'error', summary: 'Error', detail: `Missing guest details or invoice no.` } );
      return;
    }
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

