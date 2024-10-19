import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../../../_services/common.service';
import { Country } from '../../../../models/countries';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { States } from '../../../../models/states';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToggleService } from "../../../../_services/toggle.service";
import { CamelCaseToSpacePipe } from '../../../../_helpers/camelcasetospace';
import { UtilsService } from '../../../../_helpers/utils.service';

@Component( {
  selector: 'app-edit-state',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    ToastModule
  ],
  templateUrl: './edit-state.component.html',
  styleUrl: './edit-state.component.css'
} )
export class EditStateComponent implements OnInit {
  countries: Country[] = [];
  states: States[] = [];
  state!: States;
  activeValue: any;
  editStateForm!: FormGroup;

  constructor(
    private commonServices: CommonService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private toggleService: ToggleService,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit (): void {
    this.editStateForm = new FormGroup( {
      Id: new FormControl( '' ),
      Name: new FormControl( '', [Validators.required] ),
      Code: new FormControl( '', [Validators.required] ),
      Is_Active: new FormControl( false, [Validators.required] ),
      CountryId: new FormControl( null, [Validators.required] ),
    } );
    this.commonServices.getCountries().subscribe( {
      next: ( data ) => {
        this.countries = data.Data;
      },
      error: ( error ) => {
        console.error( error );
      }
    } );
    this.route.params.pipe(
      switchMap( ( params: Params ) => this.commonServices.getStateById( params['state-id'] ) )
    ).subscribe( {
      next: ( result ) => {
        this.state = result.Data;
        this.setFormValues();
        this.editStateForm.get( 'Is_Active' )?.valueChanges.subscribe( value => {
          this.activeValue = value ? 'Active' : 'In Active';
        } );
        if ( this.editStateForm.get( 'Is_Active' )?.value ) {
          this.editStateForm.get( 'Is_Active' )?.setValue( true );
          this.activeValue = 'Active';
        } else {
          this.editStateForm.get( 'Is_Active' )?.setValue( false );
          this.activeValue = 'In Active';
        }
      },
      error: ( result ) => {
        console.error( 'Error fetching room details', result );
      }
    } );
  }

  onCityChange ( $event: Event ) {
    throw new Error( 'Method not implemented.' );
  }

  onClose () {
    this.toggleService.toggleVisibility( false );
    this.router.navigate( ['/state'] );
  }

  onSubmit () {
    const invalidControls = this.utilsService.findInvalidControls( this.editStateForm );
    if ( invalidControls.length > 0 ) {
      // Handle the case where there are invalid controls
      console.log( 'Invalid controls:', invalidControls );
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    if ( this.editStateForm.valid ) {
      this.commonServices.updateState( this.editStateForm.value ).subscribe( {
        next: ( response ) => {
          if ( response.StatusCode === 200 )
            this.messageService.add( { severity: 'success', summary: 'Saved', detail: 'State details updated successfully' } );
          else if ( response.StatusCode == 40 )
            this.messageService.add( { severity: 'error', summary: 'Error - Duplicate record', detail: 'Failed to update state details.' } );
        },
        error: ( error ) => {
          console.error( 'Error occurred while updating state', error );
        }
      } );
    }
  }

  setFormValues () {
    this.editStateForm.setValue( {
      Id: this.state.Id,
      Name: this.state.Name,
      Code: this.state.Code,
      CountryId: this.state.CountryId,
      Is_Active: this.state.Is_Active
    } );
  }
}
