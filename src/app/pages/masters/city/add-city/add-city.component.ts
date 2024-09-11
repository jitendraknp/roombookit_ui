import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CityService } from '../../../../_services/city.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { States } from '../../../../models/states';
import { CommonService } from '../../../../_services/common.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SharedDataService } from '../../../../_services/shared-data.service';
import { City } from '../../../../models/cities';
import { addIcons } from "ionicons";
import { close } from "ionicons/icons";
import { IonIcon } from "@ionic/angular/standalone";

@Component( {
  selector: 'app-add-city',
  standalone: true,
  imports: [IonIcon,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.css'
} )
export class AddCityComponent implements OnInit {
  states: States[] = [];
  cities: City[] = [];
  message!: string;
  onCityChange ( $event: Event ) {

  }
  constructor(
    private cityService: CityService,
    private commonService: CommonService,
    private router: Router,
    private toastrService: ToastrService,
    private spinnerVisibilityService: SpinnerVisibilityService,
    private sharedDataService: SharedDataService ) {
    addIcons( { close } );
  }

  ngOnInit (): void {
    this.commonService.getAllStates().subscribe( {
      next: ( result ) => {
        if ( result.StatusCode == 200 ) {
          this.states = result.Data;
        }
        else {
          console.log( "No data found" );
          this.message = result.Message;
        }
        this.spinnerVisibilityService.hide();
      },
      error: ( error ) => {
        this.spinnerVisibilityService.hide();
        console.error( 'Error fetching states', error );
      }
    } );
  }
  cityForm = new FormGroup( {
    Name: new FormControl( '', [Validators.required] ),
    Code: new FormControl( '', [Validators.required] ),
    StateId: new FormControl( null, [Validators.required] ),
    States: new FormControl( null )
  } );
  onClose () {
    this.router.navigate( ['admin/city'] );
  }
  onSubmit () {
    if ( this.cityForm.valid ) {
      this.cityService.add( this.cityForm.value ).subscribe( {
        next: ( result ) => {
          this.toastrService.success( 'CIty added successfully.' );
          this.cities = result.Data;
          this.sharedDataService.changeCityData( this.cities );
          this.router.navigateByUrl( '/admin/city' ).then( () => {
            // window.location.reload();
          } );
        },
        error: ( error ) => {
          console.error( 'Error occurred while adding country', error );
        }
      }
      );
    }
  }
}
