import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Room } from '../../../../models/room';
import { RoomService } from '../../../../_services/room.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
@Component( {
  selector: 'app-edit-room',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, ToastModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    CardModule
  ],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.css',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

} )
export class EditRoomComponent implements OnInit {
  editRoomForm!: FormGroup;
  public room!: Room;
  resetFormSubject = new BehaviorSubject<boolean>( false );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private messageService: MessageService
  ) {

  }

  ngOnInit (): void {
    // this.editRoomForm.reset();
    this.resetFormSubject.asObservable();
    this.editRoomForm = new FormGroup( {
      id: new FormControl( '' ),
      hotelId: new FormControl( '' ),
      roomNo: new FormControl( '101', [Validators.required] ),
      floorNo: new FormControl( 1, [Validators.required] ),
      type: new FormControl( '1', [Validators.required] ),
      capacity: new FormControl( 2, [Validators.required] ),
      rentperNight: new FormControl( 150, [Validators.required] ),
      isDiscountApplicable: new FormControl( true ),
      discountValue: new FormControl( 10 ),
    } );

    this.route.params.pipe(
      switchMap( ( params: Params ) => this.roomService.getRoomById( params['room-id'] ) )
    ).subscribe( {
      next: ( result ) => {
        this.room = result.Data;
        this.setFormValues();
      },
      error: ( result ) => {
        // this.toasterService.error( 'Error fetching room details', 'Error ' );
        console.error( 'Error fetching room details', result );
      }
    } );

  }

  setFormValues () {
    this.editRoomForm.setValue( {
      id: this.room.Id,
      hotelId: this.room.HotelId,
      roomNo: this.room.RoomNo,
      floorNo: this.room.FloorNo,
      type: this.room.Type,
      capacity: this.room.Capacity,
      rentperNight: this.room.RentPerNight,
      isDiscountApplicable: this.room.IsDiscountApplicable,
      discountValue: this.room.DiscountValue
    } );
  }

  onSubmit () {
    if ( this.editRoomForm.valid ) {
      this.roomService.updateRoom( this.editRoomForm.value ).subscribe( {
        next: ( value ) => {
          if ( value.StatusCode === 200 ) {
            this.messageService.add( { severity: 'success', summary: 'Update', detail: 'Room details updated.' } );
          }
        },
        error: ( err ) => {
          console.log( err );
        },
        complete: () => {

        },
      } );
    }
  }

  onClose (): void {
    this.router.navigate( ['/room'] );
  }
}
