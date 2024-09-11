import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonCardComponent } from '../../../shared/common-card/common-card.component';
import { CountryComponent } from '../country/country.component';
import { CardDetails } from '../../../models/card_details';
import { States } from '../../../models/states';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../_services/common.service';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NoRecordsFoundComponent } from '../../no-records-found/no-records-found.component';
import { StateListComponent } from './state-list/state-list.component';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SharedDataService } from '../../../_services/shared-data.service';
import { map, Subject, takeUntil } from 'rxjs';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { IonicModule } from '@ionic/angular';

@Component( {
  selector: 'app-states',
  standalone: true,
  templateUrl: './states.component.html',
  styleUrl: './states.component.css',
  imports: [
    RouterModule,
    CountryComponent,
    NoRecordsFoundComponent,
    CardListComponent,
    StateListComponent,
    NgxPaginationModule,
    IonicModule
  ]
} )
export class StatesComponent implements OnInit, OnDestroy {
  states: States[] = [];
  message!: string;
  p: number = 1;
  public filter: string = '';
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(
    private commonServices: CommonService,
    private toastService: ToastrService,
    private sharedDataService: SharedDataService
  ) { }
  ngOnDestroy (): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private destroy$ = new Subject<void>();
  ngOnInit (): void {

    if ( this.states.length == 0 ) {
      this.commonServices.getAllStates().pipe( takeUntil( this.destroy$ ) ).subscribe( {
        next: ( data ) => {
          this.sharedDataService.currentStateData.subscribe( {
            next: ( d ) => {
              this.states = d;
            }
          } );
          this.sharedDataService.changeStateData( data.Data );
          // this.states = data.Data;
        },
        error: ( error ) => {
          this.toastService.error( 'Error fetching countries', 'Error' );
          console.error( 'Error getting countries', error );
        }
      } );
    }
  }
}
