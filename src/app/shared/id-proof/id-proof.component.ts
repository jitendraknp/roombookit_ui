import { Component, Input } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageUploadComponent } from "../image-upload/image-upload.component";
import { GuestService } from '../../_services/guest.service';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IdentificationDetail } from '../../models/identification-detail';
@Component( {
  selector: 'app-id-proof',
  standalone: true,
  imports: [
    NgSelectModule,
    ImageUploadComponent,
    ButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './id-proof.component.html',
  styleUrl: './id-proof.component.css'
} )
export class IdProofComponent {
  idProofForm = new FormGroup( {
    GuestId: new FormControl( "" ),
    IdType: new FormControl( "" ),
    IdNumber: new FormControl( "" ),
    ImageUrl: new FormControl( "" ),
    IsFrontSide: new FormControl( false ),
  } );
  @Input() public form!: FormGroup;
  onSubmit () {
    let identificationDetail: IdentificationDetail = {
      IdType: this.idProofForm.controls.IdType.value!,
      IdNumber: this.idProofForm.controls.IdNumber.value!,
      ImageUrl: this.idProofForm.controls.ImageUrl.value!,
      IsFrontSide: this.idProofForm.controls.IsFrontSide.value!
    };

    this.guestService.saveIdentificationDetails( identificationDetail ).subscribe( {
      next: ( result ) => {
        console.log( result );
      },
      error: ( err ) => {
        console.log( err );
      },
      complete: () => {
      }
    } );
  }
  constructor( private guestService: GuestService ) {

  }
}
