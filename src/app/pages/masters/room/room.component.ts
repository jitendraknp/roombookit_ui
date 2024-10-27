import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CardListComponent } from "../../../shared/card-list/card-list.component";
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NoRecordsFoundComponent } from "../../no-records-found/no-records-found.component";
import { RoomListComponent } from "./room-list/room-list.component";
import { CommonModule } from '@angular/common';
import { TooltipModule } from "primeng/tooltip";
import { NgxPaginationModule } from "ngx-pagination";
import { Button, ButtonModule } from "primeng/button";
import { ToggleService } from "../../../_services/toggle.service";
import { ProgressBarModule } from "primeng/progressbar";

@Component( {
  selector: 'app-room',
  standalone: true,
  imports: [
    CardListComponent,
    RouterOutlet,
    RouterModule,
    NoRecordsFoundComponent,
    RoomListComponent,
    CommonModule,
    TooltipModule,
    NgxPaginationModule,
    ButtonModule,
    ProgressBarModule
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
} )
export class RoomComponent implements OnInit, AfterViewInit {
  constructor() {

  }
  ngAfterViewInit (): void {
  }
  ngOnInit (): void {
  }
}
