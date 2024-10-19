import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../_services/common.service';
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
  styleUrl: './address.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AddressComponent implements OnInit {
  cities: City[] = [];
  ngOnInit (): void {
    this.commonService.getAllCities().subscribe( {
      next: ( data ) => {
        this.cities = data.Data as City[];
        this.cd.detectChanges();
      },
      error: ( error ) => {
        console.error( 'Error fetching cities', error );
      }
    } );
  }
  @Input() public form!: FormGroup;
  @Input() public groupName?: FormGroupName;
  constructor( private commonService: CommonService, private cd: ChangeDetectorRef ) { }
  onCityChange ( value: City | [] ): void {
    if ( value != null && value !== undefined ) {
      let cityId = value as City;
      this.commonService.getCityById( cityId.Id ).subscribe( {
        next: ( response ) => {
          this.form.controls['StateId'].patchValue( response.Data.States?.Name );
          this.form.controls['CountryId'].patchValue( response.Data.States?.Country?.Name );
        },
        error: ( error ) => {
          console.error( 'Error fetching states', error );
        }
      } );
    }
    else {
      this.form.controls['StateId'].patchValue( "" );
      this.form.controls['CountryId'].patchValue( "" );
    }
  }
}
