import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { CamelCaseToSpacePipe } from './camelcasetospace';

@Injectable( {
  providedIn: 'root'
} )
export class UtilsService {
  private camelCaseToSpacePipe = new CamelCaseToSpacePipe();
  constructor() { }
  public trimValue ( value: string ): string {
    return value.trim();
  }
  // Public method to format date (example utility function)
  public formatDate ( date: Date, format: string = 'yyyy-MM-dd' ): string {
    const year = date.getFullYear();
    const month = ( '0' + ( date.getMonth() + 1 ) ).slice( -2 ); // Month is zero-based
    const day = ( '0' + date.getDate() ).slice( -2 );
    return `${ year }-${ month }-${ day }`;
  }

  //To fing invalid controls
  public findInvalidControls ( fg: FormGroup ): string[] {
    const invalidControls: string[] = [];
    const controls = fg.controls;
    for ( const name in controls ) {
      if ( controls[name as keyof typeof controls].invalid ) {
        invalidControls.push( this.camelCaseToSpacePipe.transform( name.replace( "Id", "" ) ) );
      }
    }
    return invalidControls;
  }
  public validateControl ( fg: FormGroup, controlName: string ) {
    const control = fg.get( controlName );
    if ( control ) {
      control.markAsTouched();         // Mark the control as touched
      control.markAsDirty();           // Mark the control as dirty
      control.updateValueAndValidity(); // Re-evaluate the control's validity
    }
  }
  public validateControls ( formGroup: FormGroup, controlNames: string[] ): void {
    controlNames.forEach( controlName => {
      const control = formGroup.get( controlName );
      if ( control ) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    } );
  }
  public validateAndGetInvalidControls ( formGroup: FormGroup, controlNames: string[] ): string[] {
    const invalidControls: string[] = [];
    controlNames.forEach( controlName => {
      const control = formGroup.get( controlName );
      if ( control ) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();

        if ( control.invalid ) {
          invalidControls.push( this.camelCaseToSpacePipe.transform( controlName.replace( "Id", "" ) ) ); // Add to the list if the control is invalid
        }
      }
    } );
    return invalidControls; // Return the list of invalid control names
  }
  public dateRangeValidator ( formGroup: AbstractControl, CheckInDate: string, CheckOutDate: string ): ValidationErrors | null {
    const checkInDate = new Date( formGroup.get( CheckInDate )?.value );
    const checkOutDate = new Date( formGroup.get( CheckOutDate )?.value );

    if ( checkOutDate && checkInDate && checkOutDate <= checkInDate ) {
      return { invalidDateRange: true };
    }
    return null;
  }
}
