import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
// import { NgSelectModule } from '@ng-select/ng-select';
import { CountryService } from '../../../../_services/country.service';
import { Router } from '@angular/router';
import { FloatLabelModule } from "primeng/floatlabel";
import { CamelCaseToSpacePipe } from '../../../../_helpers/camelcasetospace';
@Component( {
  selector: 'app-add-country',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, FloatLabelModule, ToastModule],
  templateUrl: './add-country.component.html',
  styleUrl: './add-country.component.css',
  providers: [MessageService]
} )
export class AddCountryComponent {
  countryForm = new FormGroup( {
    Name: new FormControl( '', [Validators.required] ),
    Code: new FormControl( '', [Validators.required] ),
  } );

  constructor(
    private countryService: CountryService,
    private messageService: MessageService,
    private router: Router ) {

  }

  onClose () {
    this.router.navigate( ['/country'] );
  }
  private camelCaseToSpacePipe = new CamelCaseToSpacePipe();
  private findInvalidControls (): string[] {
    const invalidControls: string[] = [];
    const controls = this.countryForm.controls;
    for ( const name in controls ) {
      if ( controls[name as keyof typeof controls].invalid ) {
        invalidControls.push( this.camelCaseToSpacePipe.transform( name.replace( "Id", "" ) ) );
      }
    }
    return invalidControls;
  }
  onSubmit () {
    const invalidControls = this.findInvalidControls();
    if ( invalidControls.length > 0 ) {
      // Handle the case where there are invalid controls
      console.log( 'Invalid controls:', invalidControls );
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    if ( this.countryForm.valid ) {
      this.countryService.addCountry( this.countryForm.value ).subscribe( {
        next: ( response ) => {
          if ( response.StatusCode == 200 )
            this.messageService.add( { severity: 'success', summary: 'Saved', detail: 'Country details added successfully' } );
          else if ( response.StatusCode == 40 )
            this.messageService.add( { severity: 'error', summary: 'Error - Duplicate record', detail: 'Failed to add country details.' } );
        },
        error: ( error ) => {
          console.error( 'Error occurred while adding country', error );
        }
      }
      );
    }
  }
}
