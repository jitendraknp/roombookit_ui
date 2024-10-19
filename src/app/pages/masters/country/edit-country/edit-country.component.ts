import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Country } from '../../../../models/countries';
import { switchMap } from 'rxjs';
import { CountryService } from '../../../../_services/country.service';
import { CamelCaseToSpacePipe } from '../../../../_helpers/camelcasetospace';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { trimValidator } from '../../../../_helpers/trimValidator';
@Component( {
  selector: 'app-edit-country',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, ToastModule],
  templateUrl: './edit-country.component.html',
  styleUrl: './edit-country.component.css',
  providers: [MessageService]
} )
export class EditCountryComponent implements OnInit {
  @Output() isRecordUpdated = new EventEmitter<boolean>();
  editCountryForm!: FormGroup;
  country!: Country;
  countries: Country[] = [];
  activeValue: string = 'Active';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
    private messageService: MessageService,
  ) {

  }
  onActiveChange ( $event: Event ) {
    this.editCountryForm.get( 'Is_Active' )?.valueChanges.subscribe( value => {
      this.activeValue = value ? 'Active' : 'In Active';
    } );
  }

  ngOnInit (): void {
    this.editCountryForm = new FormGroup( {
      Id: new FormControl( '' ),
      Name: new FormControl( '', [Validators.required] ),
      Code: new FormControl( '', [Validators.required] ),
      Is_Active: new FormControl( false, [Validators.required] ),
    } );
    this.route.params.pipe(
      switchMap( ( params: Params ) => this.countryService.getCountryById( params['country-id'] ) )
    ).subscribe( {
      next: ( result ) => {
        this.country = result.Data;
        this.setFormValues();
        this.editCountryForm.get( 'Is_Active' )?.valueChanges.subscribe( value => {
          this.activeValue = value ? 'Active' : 'In Active';
        } );
        // this.toasterService.success('Country updated successfully.', 'Success');
      },
      error: ( result ) => {
        console.error( 'Error fetching room details', result );
      }
    } );

  }

  setFormValues () {
    this.editCountryForm.setValue( {
      Id: this.country.Id,
      Name: this.country.Name,
      Code: this.country.Code,
      Is_Active: this.country.Is_Active
    } );
    this.activeValue = this.country.Is_Active ? 'Active' : 'In Active';
  }

  onClose () {
    this.router.navigate( ['/country'] );
  }

  private camelCaseToSpacePipe = new CamelCaseToSpacePipe();
  private findInvalidControls (): string[] {
    const invalidControls: string[] = [];
    const controls = this.editCountryForm.controls;
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
    if ( this.editCountryForm.valid ) {
      this.countryService.updateCountry( this.editCountryForm.value ).subscribe( {
        next: ( data ) => {
          if ( data.StatusCode === 200 ) {

            this.country = data.Data;
            this.messageService.add( { severity: 'success', summary: 'Success', detail: 'Country details updated.' } );

          }
        },
        error: ( err ) => {
          console.log( err );
        },
      } );
    }
  }
}
