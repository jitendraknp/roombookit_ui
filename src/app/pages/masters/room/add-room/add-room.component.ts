import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../../../../_services/storage.service';
import { NgClass } from '@angular/common';
import { RoomService } from '../../../../_services/room.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgSelectModule } from '@ng-select/ng-select';
import { Button } from "primeng/button";
import { BehaviorSubject } from "rxjs";

@Component( {
  selector: 'app-add-room',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgSelectModule, Button, ToastModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.css',
  providers: [MessageService]
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
    discountValue: new FormControl( 0 )
  } );
  token!: string;
  tokenPayload: any;
  isvisible = false;

  @Output() showList!: BehaviorSubject<boolean>;
  isDisabled = true;

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private storageService: StorageService,
    private roomService: RoomService,
    private messageService: MessageService ) {

  }
  ngOnInit (): void {
    const payLoad = JSON.parse( this.GetTokenDecoded() );
    this.roomForm.get( 'hotelId' )?.setValue( payLoad.hotelId );
  }

  onSubmit (): void {
    if ( this.roomForm.valid ) {

      this.roomService.addRoom( this.roomForm.value ).subscribe( {
        next: ( data ) => {
          if ( data.StatusCode === 200 ) {
            this.messageService.add( { severity: 'success', summary: 'Saved', detail: 'Room details saved successfuly' } );
          }
          if ( data.StatusCode === 40 ) {
            this.messageService.add( { severity: 'error', summary: 'Failed- Duplicate record', detail: 'Failed to save room details.' } );
          }
        },
        error: ( err ) => console.log( err )
      } );
    }
  }

  onClose (): void {
    this.router.navigate( ['/room'] );
  }

  GetTokenDecoded (): string {
    this.token = this.storageService.getUser().Data.Token;
    this.tokenPayload = JSON.stringify( this.jwtHelper.decodeToken( this.token ) );
    return this.tokenPayload;
  }
}
