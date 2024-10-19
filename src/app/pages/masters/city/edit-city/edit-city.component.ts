import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { States } from '../../../../models/states';
import { CommonService } from '../../../../_services/common.service';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { City } from '../../../../models/cities';
import { switchMap } from 'rxjs';
import { CityService } from '../../../../_services/city.service';
import { SharedDataService } from '../../../../_services/shared-data.service';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarModule } from "primeng/progressbar";
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UtilsService } from '../../../../_helpers/utils.service';
@Component( {
  selector: 'app-edit-city',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    ProgressBarModule,
    RouterOutlet,
    ProgressBarModule,
    ToastModule
  ],
  templateUrl: './edit-city.component.html',
  styleUrl: './edit-city.component.css',
  providers: [MessageService]
} )
export class EditCityComponent implements OnInit {
  editCityForm!: FormGroup;
  @Input() city!: City;
  cities: City[] = [];
  activeValue: string = 'Active';
  states: States[] = [];

  constructor(
    private commonServices: CommonService,
    private cityService: CityService,
    private router: Router,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private route: ActivatedRoute ) {
  }

  ngOnInit (): void {
    this.editCityForm = new FormGroup( {
      Id: new FormControl( '' ),
      Name: new FormControl( '', [Validators.required] ),
      Code: new FormControl( '', [Validators.required] ),
      Is_Active: new FormControl( false, [Validators.required] ),
      StateId: new FormControl( null, [Validators.required] ),
    } );
    this.commonServices.getAllStates().subscribe( {
      next: ( data ) => {
        this.states = data.Data;
        this.route.params.pipe(
          switchMap( ( params: Params ) => this.commonServices.getCityById( params['city-id'] ) )
        ).subscribe( {
          next: ( result ) => {
            this.city = result.Data;
            this.setFormValues();
            this.editCityForm.get( 'Is_Active' )?.valueChanges.subscribe( value => {
              this.activeValue = value ? 'Active' : 'In Active';
            } );
            if ( this.editCityForm.get( 'Is_Active' )?.value ) {
              this.editCityForm.get( 'Is_Active' )?.setValue( true );
              this.activeValue = 'Active';
            } else {
              this.editCityForm.get( 'Is_Active' )?.setValue( false );
              this.activeValue = 'In Active';
            }
          },
          error: ( result ) => {
            console.error( 'Error fetching room details', result );
          }
        } );
      },
      error: ( error ) => {
        console.error( error );
      }
    } );
  }

  onClose () {
    this.router.navigate( ['/city'] );
  }

  onSubmit () {
    const invalidControls = this.utilsService.findInvalidControls( this.editCityForm );
    if ( invalidControls.length > 0 ) {
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    if ( this.editCityForm.valid ) {
      this.cityService.update( this.editCityForm.value ).subscribe( {
        next: ( response ) => {
          this.cities = response.Data as City[];
          if ( response.StatusCode == 200 )
            this.messageService.add( { severity: 'success', summary: 'Saved', detail: 'City details added successfully' } );
          else if ( response.StatusCode == 40 )
            this.messageService.add( { severity: 'error', summary: 'Error - Duplicate record', detail: 'Failed to add city details.' } );
        },
        error: ( error ) => {
          console.error( error );
        }
      } );
    }
  }

  onCityChange ( $event: any ) {

  }

  setFormValues () {
    this.editCityForm.setValue( {
      Id: this.city.Id,
      Name: this.city.Name,
      Code: this.city.Code,
      StateId: this.city.StateId,
      Is_Active: this.city.Is_Active
    } );
  }
}
