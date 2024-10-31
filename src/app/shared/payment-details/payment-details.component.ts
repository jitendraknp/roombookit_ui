import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { GuestService } from '../../_services/guest.service';
import { PaymentDetail, PaymentHistory } from '../../models/payment-detail';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
@Component( {
  selector: 'app-payment-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    ButtonModule,
    FluidModule,
    InputTextModule,
    CardModule,
    InputNumberModule,
    ToastModule,
    DatePickerModule,
    TableModule
  ],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css',
  providers: [MessageService]
} )
export class PaymentDetailsComponent implements OnInit, AfterViewInit {
  @Input() public form!: FormGroup;
  gstControl = new FormControl( 12 );
  @Input() isEditForm: boolean = false;
  constructor( private guestService: GuestService, private messageService: MessageService, private cdr: ChangeDetectorRef ) {

  }
  ngAfterViewInit (): void {
    if ( this.isEditForm ) {
      this.guestService.getPaymentHistory( this.form.controls['PaymentDetailsId'].value ).subscribe( {
        next: ( response ) => {
          if ( response.StatusCode == 200 ) {
            this.payments = response.Data as PaymentHistory[];
            this.cdr.detectChanges();
          }
        },
        error: ( error ) => {
          console.log( error );
        },
        complete: () => {

        }
      } );
    }
  }
  payments!: PaymentHistory[];
  showGSTDetailInputs: boolean = false;
  onGstChange ( $event: any ) {
    // this.gstControl.valueChanges.subscribe( value => {

    let totalAmount = Number( this.form.controls["TotalAmount"].value );
    if ( Number( $event ) == 1 ) {
      this.form.controls["ExcGST"].patchValue( totalAmount );
    } else {
      let gstAmount: number = ( totalAmount * Number( $event ) / 100 ) + Number( totalAmount );
      this.form.controls["ExcGST"].patchValue( gstAmount );
      // } );
    }
  }

  ngOnInit (): void {

    this.form.controls['PaymentMode'].valueChanges.subscribe( value => {
      if ( value == 1 || value == 3 ) {
        this.form.controls['TransactionNo'].enable();
        this.form.controls['TransactionNo'].addValidators( [Validators.required] );
      } else
        this.form.controls['TransactionNo'].disable();
      this.form.controls['TransactionNo'].removeValidators( [Validators.required] );
    } );
    this.form.controls['AmountPaid'].valueChanges.subscribe( value => {
      const gstAmt = this.form.controls["ExcGST"].value;
      const balance = gstAmt - value;
      console.log( balance );
      if ( Number( balance ) < 0 ) {
        this.messageService.add( { severity: 'warn', summary: 'Warning', detail: 'Balance amount should not be less than 0' } );
      }
      this.form.controls["BalanceAmount"].patchValue( balance );
    } );


  };

  // onSubmit () {
  //   console.log( this.form );
  //   let form = this.form;
  //   let paymentDetail: PaymentDetail = {
  //     Id: form.controls['Id'].value!,
  //     PaymentMode: String( form.controls['PaymentMode'].value! ),
  //     TransactionNo: form.controls['TransactionNo'].value!,
  //     GSTPercentage: form.controls['GSTPercentage'].value!,
  //     AmountToPay: form.controls['AmountToPay'].value!,
  //     AmountPaid: form.controls['AmountPaid'].value!,
  //     BalanceAmount: form.controls['BalanceAmount'].value!,
  //     IncGST: form.controls['IncGST'].value!,
  //     ExcGST: form.controls['ExcGST'].value!,
  //     Discount: 0
  //   };
  //   this.guestService.savePaymentDetails( paymentDetail ).subscribe( {
  //     next: ( result ) => {
  //       console.log( 'result' );
  //       console.log( result );
  //     },
  //     error: ( err ) => {
  //       console.log( err );
  //     },
  //     complete: () => {

  //     }
  //   } );

  // }
}
