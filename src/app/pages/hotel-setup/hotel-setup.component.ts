import { AfterRenderRef, Component, EventEmitter, Output } from '@angular/core';
import { AfterViewInit, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../_services/common.service';
import { Country } from '../../models/countries';
import { States } from '../../models/states';
import { City } from '../../models/cities';
import { SetupHotelService } from '../../_services/setup-hotel.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Hotel } from '../../models/hotel';

@Component( {
  selector: 'app-hotel-setup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgSelectModule, NgIf],
  templateUrl: './hotel-setup.component.html',
  styleUrl: './hotel-setup.component.css'
} )
export class HotelSetupComponent implements OnInit, AfterViewInit, AfterRenderRef {

  constructor( private commonService: CommonService, private router: Router, private hotelService: SetupHotelService ) {
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
    console.log( 'Country changed', value );
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
    console.log( 'State changed', value );
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
      console.log( this.hotelSetupForm.value );
      this.hotelService.setUpHotel( this.hotelSetupForm.value ).subscribe( {
        next: ( data ) => {
          this.hotelAreadySetup.emit( false );
          this.router.navigate( ['/admin-setup'] );
        },
        error: ( err ) => console.log( err )
      } );
    }
  }
  onCancel () {
    this.router.navigate( ['/login'] );

  }
}
