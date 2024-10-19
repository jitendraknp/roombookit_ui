import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Country } from '../../../../models/countries';
import { States } from '../../../../models/states';
import { Router } from '@angular/router';
import { CommonService } from '../../../../_services/common.service';
import { CountryService } from '../../../../_services/country.service';
import { UtilsService } from '../../../../_helpers/utils.service';

@Component( {
  selector: 'app-add-state',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    ToastModule
  ],
  templateUrl: './add-state.component.html',
  styleUrl: './add-state.component.css',
  providers: [MessageService]
} )
export class AddStateComponent implements OnInit {
  countries: Country[] = [];
  states: States[] = [];
  stateForm = new FormGroup( {
    Name: new FormControl( '', [Validators.required] ),
    Code: new FormControl( '', [Validators.required] ),
    CountryId: new FormControl( null, [Validators.required] ),
    Is_Active: new FormControl( true ),
  } );

  constructor(
    private router: Router,
    private commonService: CommonService,
    private countryService: CountryService,
    private utilsService: UtilsService,
    private messageService: MessageService ) {
  }

  ngOnInit (): void {
    this.countryService.getAll().subscribe( country => {
      this.countries = country.Data;
    } );
  }

  onClose () {
    this.router.navigate( ['/state'] );
  }

  onSubmit () {
    const invalidControls = this.utilsService.findInvalidControls( this.stateForm );
    if ( invalidControls.length > 0 ) {
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    if ( this.stateForm.valid ) {
      this.commonService.saveState( this.stateForm.value ).subscribe( {
        next: ( response ) => {
          if ( response.StatusCode === 200 )
            this.messageService.add( { severity: 'success', summary: 'Saved', detail: 'State details added successfully' } );
          else if ( response.StatusCode == 40 )
            this.messageService.add( { severity: 'error', summary: 'Error - Duplicate record', detail: 'Failed to add state details.' } );
        },
        error: ( error ) => {
          console.log( error );
        },
        complete: () => {
          this.stateForm.reset();
        }
      } );
    }
  }
}
