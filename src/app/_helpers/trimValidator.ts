import { AbstractControl, ValidatorFn } from '@angular/forms';

export function trimValidator (): ValidatorFn {
    return ( control: AbstractControl ): { [key: string]: any; } | null => {
        if ( control && control.value && typeof control.value === 'string' ) {
            // Trim the value
            const trimmedValue = control.value.trim();

            // Update the control's value after trimming
            control.setValue( trimmedValue, { emitEvent: false } );

            // Validation: check if the trimmed value is empty
            if ( trimmedValue === '' ) {
                return { 'trimError': 'Value cannot be empty after trimming' };
            }
        }
        return null;
    };
}
