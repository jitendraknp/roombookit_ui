import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { States } from '../../../../models/states';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { NgxPaginationModule } from "ngx-pagination";
import { NoRecordsFoundComponent } from "../../../no-records-found/no-records-found.component";
import { TooltipModule } from "primeng/tooltip";
import { CommonService } from "../../../../_services/common.service";
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';

@Component( {
  selector: 'app-state-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BadgeModule,
    ButtonModule,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    TooltipModule,
    FloatLabelModule,
    AutoCompleteModule,
    CardModule,
  ],
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.css',
  encapsulation: ViewEncapsulation.None,
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
