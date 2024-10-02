import { AfterRenderRef, Component, EventEmitter, Output } from '@angular/core';
import { AfterViewInit, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../_services/common.service';
import { Country } from '../../models/countries';
import { States } from '../../models/states';
import { City } from '../../models/cities';
import { SetupHotelService } from '../../_services/setup-hotel.service';
import { NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Hotel } from '../../models/hotel';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
@Component( {
  selector: 'app-hotel-setup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgSelectModule, NgIf, ToastModule, MessagesModule],
  templateUrl: './hotel-setup.component.html',
  styleUrl: './hotel-setup.component.css',
  providers: [ConfirmationService, MessageService]
} )
export class HotelSetupComponent implements OnInit, AfterViewInit, AfterRenderRef {
  messages!: Message[];
  constructor( private commonService: CommonService, private router: Router, private hotelService: SetupHotelService, private messageService: MessageService ) {
  }
  destroy (): void {
  }
  ngAfterViewInit (): void {
    this.commonService.getCountries().subscribe( {
      next: ( data ) => {
        this.countries = data.Data;
      },
      error: ( error ) => {
        console.error( 'Error fetching countries', error );
      }
    } );
  }
  // Form controls and validators
  countries: Country[] = [];
  states: States[] = [];
  cities: City[] = [];
  hotel: Hotel | undefined;

  hotelSetupForm: FormGroup = new FormGroup( {
    name: new FormControl( "", [Validators.required, Validators.minLength( 10 ), Validators.maxLength( 50 )] ),
    code: new FormControl( "", [Validators.required] ),
    emailId: new FormControl( "", [Validators.required] ),
    InvNoSuffix: new FormControl( "" ),
    LastInvNo: new FormControl( "" ),
    website: new FormControl( "" ),
    phoneNo: new FormControl( "" ),
    address: new FormControl( "", [Validators.required] ),
    address1: new FormControl( "" ),
    address2: new FormControl( "" ),
    GSTIN: new FormControl( "" ),
    CIN: new FormControl( "" ),
    PAN: new FormControl( "" ),
    countryId: new FormControl( null, [Validators.required] ),
    stateId: new FormControl( null, [Validators.required] ),
    cityId: new FormControl( null, [Validators.required] ),
    pincode: new FormControl( "", [Validators.required] ),
  } );

  @Output() hotelAreadySetup: EventEmitter<boolean> = new EventEmitter( true );

  ngOnInit () {
    this.messages = [
      { severity: 'info', detail: 'Info Message' },
      { severity: 'success', detail: 'Success Message' },
      { severity: 'warn', detail: 'Warning Message' },
      { severity: 'error', detail: 'Error Message' },
      { severity: 'secondary', detail: 'Secondary Message' },
      { severity: 'contrast', detail: 'Contrast Message' }
    ];
    this.hotelService.getHotels().subscribe( {
      next: ( data ) => {
        this.hotel = data.Data[0];
        if ( data.Data.length > 0 ) {
          this.hotelSetupForm.controls['name'].patchValue( this.hotel?.Name );
          this.hotelSetupForm.controls['code'].patchValue( this.hotel?.Code );
          this.hotelSetupForm.controls['emailId'].patchValue( this.hotel?.EmailId );
          this.hotelSetupForm.controls['website'].patchValue( this.hotel?.Website );
          this.hotelSetupForm.controls['phoneNo'].patchValue( this.hotel?.PhoneNo );
          this.hotelSetupForm.controls['address'].patchValue( this.hotel?.Address );
          this.hotelSetupForm.controls['address1'].patchValue( this.hotel?.Address1 );
          this.hotelSetupForm.controls['GSTIN'].patchValue( this.hotel?.GSTIN );
          this.hotelSetupForm.controls['CIN'].patchValue( this.hotel?.CIN );
          this.hotelSetupForm.controls['PAN'].patchValue( this.hotel?.PAN );
          this.hotelSetupForm.controls['countryId'].patchValue( this.hotel?.CountryId );
          this.onCountryChange( this.hotel?.CountryId! );
          this.hotelSetupForm.controls['stateId'].patchValue( this.hotel?.StateId );
          this.onStateChange( this.hotel?.StateId! );
          this.hotelSetupForm.controls['cityId'].patchValue( this.hotel?.CityId );
          this.hotelSetupForm.controls['pincode'].patchValue( this.hotel?.Pincode );
          this.hotelSetupForm.controls['InvNoSuffix'].patchValue( this.hotel?.InvNoSuffix );
          this.hotelSetupForm.controls['LastInvNo'].patchValue( this.hotel?.LastInvNo );
          // this.hotelSetupForm.disable();
          let isExists = ( data.Data == null ) ? false : true;
          this.hotelAreadySetup.emit( isExists );
        }
      },
      error: ( error ) => {
        console.error( 'Error fetching hotels', error );
      }
    } );
  }

  onCountryChange ( value: string ): void {
    if ( value !== '' && value !== undefined ) {
      this.commonService.getStates( value ).subscribe( {
        next: ( data ) => {
          this.states = data.Data;
        },
        error: ( error ) => {
          console.error( 'Error fetching states', error );
        }
      } );
    }
  }

  onStateChange ( value: string ) {
    if ( value !== '' && value !== undefined ) {
      this.commonService.getCities( value ).subscribe( {
        next: ( data ) => {
          console.log( 'Cities fetched', data.Data );
          this.cities = data.Data;
        },
        error: ( error ) => {
          console.error( 'Error fetching cities', error );
        }
      } );
    }
  }

  //Submit data

  onSubmit () {
    if ( this.hotelSetupForm.valid ) {
      this.hotelService.setUpHotel( this.hotelSetupForm.value ).subscribe( {
        next: ( data ) => {
          this.hotelAreadySetup.emit( false );
          this.router.navigate( ['/hotel-setup'] );
        },
        error: ( err ) => console.log( err )
      } );
    }
  }
  onCancel () {
    // this.messages = [{ severity: 'info', detail: 'Message Content' }];
    this.messageService.add( { severity: 'error', detail: 'Yet to implement' } );

  }
}
