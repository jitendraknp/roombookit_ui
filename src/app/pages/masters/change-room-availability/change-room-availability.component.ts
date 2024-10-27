import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { RoomService } from '../../../_services/room.service';
import { Room } from '../../../models/room';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { BookingService } from '../../../_services/booking.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Message } from 'primeng/message';
import { forkJoin } from 'rxjs';
@Component( {
  selector: 'app-change-room-availability',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    BadgeModule,
    TagModule,
    ConfirmPopupModule,
    ToastModule
  ],
  templateUrl: './change-room-availability.component.html',
  styleUrl: './change-room-availability.component.css',
  providers: [ConfirmationService, MessageService, Message]
} )
export class ChangeRoomAvailabilityComponent implements OnInit {
  constructor( private roomService: RoomService,
    private bookingService: BookingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {

  }

  @Input() rooms: Room[] = [];
  @Output() updatedRooms: EventEmitter<Room[]> = new EventEmitter();
  ngOnInit (): void {

  }
  getSeverity ( status: boolean ) {
    switch ( status ) {
      case false:
        return 'danger';
      default:
        return 'success';
    }
  }

  onAvailabilityChange ( id: string ) {

    alert( id );
  }
  confirm ( event: Event, id: string ) {
    this.confirmationService.confirm( {
      target: event.target as EventTarget,
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Save'
      },
      accept: () => {
        const room = this.rooms.filter( f => f.Id == id ).map( x =>
          x.Id === id
            ? { ...x, AvailablityStatus: { ...x.AvailablityStatus, IsAvailable: true } }
            : x
        );
        console.log( room );
        forkJoin( [
          this.bookingService.updateAvailability( room[0] ),

        ] ).subscribe( {
          next: ( [bookingServiceData] ) => {
          },
          error: ( error ) => {
            console.log( error );
          },
          complete: () => {
            this.roomService.getAllRooms().subscribe( {
              next: ( response ) => {
                this.rooms = response.Data as Room[];
                this.updatedRooms.emit( response.Data );
              },
              error: ( err ) => {
                console.log( err );
              },
              complete: () => {

                this.messageService.add( { severity: 'success', summary: 'Confirmed', detail: 'You have accepted', life: 3000 } );
              }
            } );
          }
        } );
      },
      reject: () => {
        this.messageService.add( { severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 } );
      }
    } );
  }
}
