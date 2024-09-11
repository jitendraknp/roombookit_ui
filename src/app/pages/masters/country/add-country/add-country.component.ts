import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryService } from '../../../../_services/country.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { addIcons } from "ionicons";
import { close } from "ionicons/icons";
import { IonicModule } from '@ionic/angular';

@Component( {
  selector: 'app-add-country',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgSelectModule, IonicModule],
  templateUrl: './add-country.component.html',
  styleUrl: './add-country.component.css'
} )
export class AddCountryComponent {
  constructor( private countryService: CountryService, private toastrService: ToastrService, private router: Router, ) {
    addIcons( { close } );
  }
  countryForm = new FormGroup( {
    Name: new FormControl( '', [Validators.required] ),
    Code: new FormControl( '', [Validators.required] ),
  } );
  onClose () {
    this.router.navigate( ['admin/country'] );
  }
  onSubmit () {
    if ( this.countryForm.valid ) {
      this.countryService.addCountry( this.countryForm.value ).subscribe( {
        next: () => {
          this.toastrService.success( 'Country added successfully', 'Success' );
          this.router.navigateByUrl( '/admin/country' ).then( () => {
            window.location.reload();
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
