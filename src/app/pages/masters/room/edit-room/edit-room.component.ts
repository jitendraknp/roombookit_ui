import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { Room } from '../../../../models/room';
import { RoomService } from '../../../../_services/room.service';
import { ToastrService } from 'ngx-toastr';
import { addIcons } from "ionicons";
import { close } from "ionicons/icons";
import { IonicModule } from '@ionic/angular';

@Component( {
  selector: 'app-edit-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, IonicModule],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.css'

} )
export class EditRoomComponent implements OnInit {
  editRoomForm!: FormGroup;
  public room!: Room;
  resetFormSubject = new BehaviorSubject<boolean>( false );
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private toasterService: ToastrService
  ) {
    addIcons( { close } );
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
    console.log( this.route.snapshot.params['room-id'] );

    this.route.params.pipe(
      switchMap( ( params: Params ) => this.roomService.getRoomById( params['room-id'] ) )
    ).subscribe( {
      next: ( result ) => {
        this.room = result.Data;
        console.log( this.room );
        this.setFormValues();
      },
      error: ( result ) => {
        this.toasterService.error( 'Error fetching room details', 'Error ' );
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
      // Handle form submission
      // this.roomService.updateRoom(this.editRoomForm.value).subscribe({
      //   next: (data) => {
      //     if (data.StatusCode === 200) {
      //       this.toasterService.success(data.Message, 'Success');

      //       this.router.navigateByUrl('/admin/room').then(() => {
      //         //  window.location.reload();
      //       });
      //     }
      //   },
      //   error: (err) => {
      //     console.log(err);
      //   }
      // }).add(() => {
      //   this.resetFormSubject.next(true);
      // });
      this.roomService.updateRoom( this.editRoomForm.value ).subscribe( room => {
        this.resetFormSubject.next( true );
        this.router.navigate( ['admin/room'] ).then( () => {
          this.toasterService.success( room.Message, 'Success' ).onHidden.subscribe( () => {
            window.location.reload();
          } );
        } );
      } ).add( () => {
        this.resetFormSubject.asObservable();
      } );
    }
  }
  onClose (): void {
    // Handle close action, e.g., navigate away
    this.router.navigate( ['admin/room'] ); // Assuming you have a route to navigate back to the rooms list
  }
}
