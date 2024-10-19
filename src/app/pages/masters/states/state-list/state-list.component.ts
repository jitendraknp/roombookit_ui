import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { States } from '../../../../models/states';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BadgeModule } from "primeng/badge";
import { Button } from "primeng/button";
import { NgxPaginationModule } from "ngx-pagination";
import { NoRecordsFoundComponent } from "../../../no-records-found/no-records-found.component";
import { TooltipModule } from "primeng/tooltip";
import { CommonService } from "../../../../_services/common.service";

@Component( {
  selector: 'app-state-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BadgeModule,
    Button,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    TooltipModule
  ],
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.css'
} )
export class StateListComponent implements OnInit {
  states: States[] = [];
  p: number = 1;

  constructor(
    private commonServices: CommonService,
    private cd: ChangeDetectorRef,
    private router: Router ) {
  }

  ngOnInit (): void {
    this.commonServices.getAllStates().subscribe( {
      next: ( data ) => {
        this.states = data.Data as States[];
        this.cd.detectChanges();
      },
      error: ( error ) => {
        console.error( 'Error getting countries', error );
      }
    } );
  }

  addState () {
    this.router.navigate( ['/state/add'] );
  }

  onStateEdit ( id: string ) {
    this.router.navigate( ['state/edit', id] );
  }
}
