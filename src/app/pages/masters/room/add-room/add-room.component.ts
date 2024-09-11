import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../../../../_services/storage.service';
import { NgClass } from '@angular/common';
import { RoomService } from '../../../../_services/room.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { addIcons } from "ionicons";
import { close } from "ionicons/icons";
import { IonicModule } from '@ionic/angular';

@Component( {
  selector: 'app-add-room',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgSelectModule, IonicModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.css'
} )
export class AddRoomComponent implements OnInit {
  roomForm = new FormGroup( {
    hotelId: new FormControl( '', [Validators.required] ),
    roomNo: new FormControl( "", [Validators.required] ),
    floorNo: new FormControl( '', [Validators.required] ),
    type: new FormControl( '1', [Validators.required] ),
    capacity: new FormControl( '', [Validators.required] ),
    rentperNight: new FormControl( '', [Validators.required] ),
    isDiscountApplicable: new FormControl( false ),
    discountValue: new FormControl( '', [Validators.required] )
  } );
  token!: string;
  tokenPayload: any;
  isDisabled = true;
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private storageService: StorageService, private roomService: RoomService, private toastrService: ToastrService ) {
    addIcons( { close } );
  }

  ngOnInit (): void {
    const payLoad = JSON.parse( this.GetTokenDecoded() );
    this.roomForm.get( 'hotelId' )?.setValue( payLoad.hotelId );

    // this.route.queryParams.subscribe(params => {
    //   const returnUrl = params['returnUrl'] || '/admin/room';
    //   // Now, you can navigate to the returnUrl if needed
    //   this.router.navigateByUrl(returnUrl);
    // });
  }

  onSubmit (): void {
    if ( this.roomForm.valid ) {
      // Handle form submission
      this.roomService.addRoom( this.roomForm.value ).subscribe( {
        next: ( data ) => {
          if ( data.StatusCode === 200 ) {
            console.log( data );
            this.toastrService.success( data.Message, 'Success' );
            // this.router.navigate(['admin/room'], { queryParams: { returnUrl: this.router.url } });
            this.router.navigateByUrl( '/admin/room' ).then( () => {
              window.location.reload();
            } ); // Assuming you have a route to navigate back to the rooms list
          }
        },
        error: ( err ) => console.log( err )
      } );
    }
  }
  onClose (): void {
    // Handle close action, e.g., navigate away
    this.router.navigate( ['admin/room'] ); // Assuming you have a route to navigate back to the rooms list
  }
  GetTokenDecoded (): string {
    this.token = this.storageService.getUser().Data.Token;
    // console.log(this.jwtHelper.decodeToken(this.token));
    // this.jwtHelper.isTokenExpired(this.token);
    this.tokenPayload = JSON.stringify( this.jwtHelper.decodeToken( this.token ) );
    return this.tokenPayload;
  }
}
