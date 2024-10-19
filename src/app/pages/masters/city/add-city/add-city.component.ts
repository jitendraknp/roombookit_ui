import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CityService } from '../../../../_services/city.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { States } from '../../../../models/states';
import { CommonService } from '../../../../_services/common.service';
import { City } from '../../../../models/cities';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UtilsService } from '../../../../_helpers/utils.service';
@Component( {
  selector: 'app-add-city',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule, ToastModule
  ],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.css',
  providers: [MessageService]
} )
export class AddCityComponent implements OnInit {
  states: States[] = [];
  cities: City[] = [];
  message!: string;
  cityForm = new FormGroup( {
    Name: new FormControl( '', [Validators.required] ),
    Code: new FormControl( '', [Validators.required] ),
    StateId: new FormControl( null, [Validators.required] ),
    States: new FormControl( null )
  } );

  constructor(
    private cityService: CityService,
    private commonService: CommonService,
    private router: Router,
    private utilsService: UtilsService,
    private messageService: MessageService, ) {

  }

  onCityChange ( $event: Event ) {

  }

  ngOnInit (): void {
    this.commonService.getAllStates().subscribe( {
      next: ( result ) => {
        if ( result.StatusCode == 200 ) {
          this.states = result.Data as States[];
        } else {
          console.log( "No data found" );
          this.message = result.Message;
        }
      },
      error: ( error ) => {
        console.error( 'Error fetching states', error );
      }
    } );
  }

  onClose () {
    this.router.navigate( ['/city'] );
  }

  onSubmit () {
    const invalidControls = this.utilsService.findInvalidControls( this.cityForm );
    if ( invalidControls.length > 0 ) {
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    if ( this.cityForm.valid ) {
      this.cityService.add( this.cityForm.value ).subscribe( {
        next: ( response ) => {
          this.cities = response.Data as City[];
          if ( response.StatusCode == 200 )
            this.messageService.add( { severity: 'success', summary: 'Saved', detail: 'City details added successfully' } );
          else if ( response.StatusCode == 40 )
            this.messageService.add( { severity: 'error', summary: 'Error - Duplicate record', detail: 'Failed to add city details.' } );
        },
        error: ( error ) => {
          console.error( 'Error occurred while adding country', error );
        },
        complete: () => {
          this.cityForm.reset();
        }
      }
      );
    }
  }
}
