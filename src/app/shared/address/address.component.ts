import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../_services/common.service';
import { Country } from '../../models/countries';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/response';
import { States } from '../../models/states';
import { City } from '../../models/cities';

@Component( {
  selector: 'app-address',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
} )
export class AddressComponent implements OnInit {
  countries: Country[] = [];
  states: States[] = [];
  cities: City[] = [];
  ngOnInit (): void {
    console.log( this.form );
    this.commonService.getAllCities().subscribe( {
      next: ( data ) => {
        this.cities = data.Data;
      },
      error: ( error ) => {
        console.error( 'Error fetching cities', error );
      }
    } );
    this.getCountry().subscribe( {
      next: ( data ) => {
        this.countries = data.Data;
      },
      error: ( error ) => {
        console.error( 'Error fetching countries', error );
      }
    } );
    this.getStates().subscribe( {
      next: ( data ) => {
        this.states = data.Data;
      },
      error: ( error ) => {
        console.error( 'Error fetching states', error );
      }
    } );
  }
  @Input() public form!: FormGroup;
  @Input() public groupName?: FormGroupName;
  constructor( private commonService: CommonService ) { }
  getCountry (): Observable<ApiResponse> {
    return this.commonService.getCountries();
  }
  getStates (): Observable<ApiResponse> {
    return this.commonService.getAllStates();
  }
  onCityChange ( value: string ): void {
    if ( value !== '' && value !== undefined ) {
      this.commonService.getCityById( value ).subscribe( {
        next: ( data ) => {
          this.form.controls['StateId'].patchValue( data.Data.StateId );
          this.form.controls['CountryId'].patchValue( data.Data.CountryId );
        },
        error: ( error ) => {
          console.error( 'Error fetching states', error );
        }
      } );
    }
  }
}
