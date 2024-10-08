import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { addIcons } from "ionicons";
import { ButtonModule } from 'primeng/button';
import { GuestService } from '../../_services/guest.service';
import { PaymentDetail } from '../../models/payment-detail';
@Component( {
  selector: 'app-payment-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    ButtonModule
  ],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
} )
export class PaymentDetailsComponent implements OnInit {
  constructor( private guestService: GuestService ) {

  }
  @Input() public form!: FormGroup;
  ngOnInit (): void {
    this.paymentDetailsForm.controls.PaymentMode.valueChanges.subscribe( value => {
      if ( value == "1" || value == "3" ) {
        this.paymentDetailsForm.controls.TransactionNo.enable();
        this.paymentDetailsForm.controls.TransactionNo.addValidators( [Validators.required] );
      }
      else
        this.paymentDetailsForm.controls.TransactionNo.disable();
      this.paymentDetailsForm.controls.TransactionNo.removeValidators( [Validators.required] );
    } );
  }
  paymentDetailsForm = new FormGroup( {
    // RatePerNight: new FormControl<number>( { value: 0, disabled: true }, [Validators.required] ),
    AmountToPay: new FormControl<number>( { value: 0, disabled: true } ),
    GSTPercentage: new FormControl<number>( 12 ),
    IncGST: new FormControl( 0 ),
    ExcGST: new FormControl( 0 ),
    PaymentMode: new FormControl( null, [Validators.required] ),
    AmountPaid: new FormControl<number>( 0, [Validators.required] ),
    BalanceAmount: new FormControl<number>( { value: 0, disabled: true }, [Validators.required] ),
    TransactionNo: new FormControl<string>( { value: '', disabled: true }, [Validators.required] ),
  } );

  onSubmit () {
    console.log( this.paymentDetailsForm );
    let form = this.paymentDetailsForm;
    let paymentDetail: PaymentDetail = {
      PaymentMode: String( form.controls.PaymentMode.value! ),
      TransactionNo: form.controls.TransactionNo.value!,
      GSTPercentage: form.controls.GSTPercentage.value!,
      AmountToPay: form.controls.AmountToPay.value!,
      AmountPaid: form.controls.AmountPaid.value!,
      BalanceAmount: form.controls.BalanceAmount.value!,
      IncGST: form.controls.IncGST.value!,
      ExcGST: form.controls.ExcGST.value!,
      Discount: 0
    };
    console.log( paymentDetail );
    this.guestService.savePaymentDetails( paymentDetail ).subscribe( {
      next: ( result ) => {
        console.log( 'result' );
        console.log( result );
      },
      error: ( err ) => {
        console.log( err );
      },
      complete: () => {

      }
    } );

  }
}
