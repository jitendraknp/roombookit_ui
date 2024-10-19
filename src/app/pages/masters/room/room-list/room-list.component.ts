import { ChangeDetectorRef, Component, Input, OnInit, Output } from '@angular/core';
import { Room } from '../../../../models/room';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TooltipModule } from "primeng/tooltip";
import { CommonService } from "../../../../_services/common.service";
import { Button } from "primeng/button";
import { NgxPaginationModule } from "ngx-pagination";
import { NoRecordsFoundComponent } from "../../../no-records-found/no-records-found.component";
import { BadgeModule } from "primeng/badge";

@Component( {
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    TooltipModule,
    Button,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    BadgeModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
} )
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  bookedRooms: number = 0;
  availableRooms: number = 0;
  p: number = 1;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private commonServices: CommonService ) {
  }

  ngOnInit (): void {
    this.commonServices.getAllRooms().subscribe( {
      next: ( data ) => {
        this.rooms = data.Data as Room[];
        if ( this.rooms?.length > 0 ) {
          this.bookedRooms = this.rooms[0].Booked!;
          this.availableRooms = this.rooms[0].Available!;
        }
        this.cd.detectChanges();
      },
      error: ( error ) => {
        console.error( 'Error getting rooms', error );
      }
    } );
  }

  onRoomEdit ( id: string ) {
    this.router.navigate( ['room/edit', id] );
  }

  addRoom () {
    this.router.navigate( ['/room/add'] );
  }
}
