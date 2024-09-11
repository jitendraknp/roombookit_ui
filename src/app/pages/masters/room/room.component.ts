import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardListComponent } from "../../../shared/card-list/card-list.component";
import { CommonService } from '../../../_services/common.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NoRecordsFoundComponent } from "../../no-records-found/no-records-found.component";
import { Room } from '../../../models/room';
import { RoomListComponent } from "./room-list/room-list.component";
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { personAddSharp } from "ionicons/icons";

@Component( {
  selector: 'app-room',
  standalone: true,
  imports: [IonIcon,
    CardListComponent,
    RouterOutlet,
    RouterModule,
    NoRecordsFoundComponent,
    RoomListComponent,
    CommonModule
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
} )
export class RoomComponent implements OnInit, OnChanges, AfterViewInit {
  rooms: Room[] = [];
  @Input() resetFormSubject!: BehaviorSubject<boolean>;
  constructor( private commonServices: CommonService ) {
    addIcons( { personAddSharp } );
  }
  ngAfterViewInit (): void {
    this.commonServices.getAllRooms().subscribe( {
      next: ( data ) => {
        this.rooms = data.Data;
      },
      error: ( error ) => {
        console.error( 'Error getting rooms', error );
      }
    } );
  }

  ngOnChanges ( changes: SimpleChanges ): void {
    console.log( this.resetFormSubject );
    if ( this.resetFormSubject != undefined ) {
      this.resetFormSubject.next( true );
    }
  }
  ngOnInit (): void {

  }
}
