import { ChangeDetectorRef, Component, Input, OnInit, Output } from '@angular/core';
import { Room } from '../../../../models/room';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from "primeng/tooltip";
import { CommonService } from "../../../../_services/common.service";
import { ButtonModule } from "primeng/button";
import { NgxPaginationModule } from "ngx-pagination";
import { NoRecordsFoundComponent } from "../../../no-records-found/no-records-found.component";
import { BadgeModule } from "primeng/badge";
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { ChangeRoomAvailabilityComponent } from '../../change-room-availability/change-room-availability.component';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';

@Component( {
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    TableModule,
    TooltipModule,
    ButtonModule,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    InputTextModule,
    FluidModule,
    AutoCompleteModule,
    CardModule,
    FloatLabelModule,
    DialogModule,
    BadgeModule,
    AvatarModule,
    PaginatorModule,
    ChangeRoomAvailabilityComponent
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
} )
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  display: boolean = false;
  bookedRooms: number = 0;
  availableRooms: number = 0;
  p: number = 1;
  @Input() updatedRooms: Room[] = [];
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
  onAvailabilityUpdate ( $event: Room[] ) {
    console.log( 'changed' );
    this.rooms = $event;
    this.cd.detectChanges();
  }
  onRoomEdit ( id: string ) {
    this.router.navigate( ['room/edit', id] );
  }

  addRoom () {
    this.router.navigate( ['/room/add'] );
  }
  changeRoomAvailability () {
    this.display = true;
  }
  rowsPerPage = 10;
  currentPage = 0;

  // Getter for paged cities
  get pagedRooms () {
    const start = this.currentPage * this.rowsPerPage;
    return this.rooms.slice( start, start + this.rowsPerPage );
  }

  onPageChange ( event: any ) {
    this.currentPage = event.page;
  }
}
