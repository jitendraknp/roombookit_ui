import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CardListComponent } from "../../../shared/card-list/card-list.component";
import { City } from '../../../models/cities';
import { CityService } from '../../../_services/city.service';
import { NoRecordsFoundComponent } from '../../no-records-found/no-records-found.component';
import { CityListComponent } from './city-list/city-list.component';
import { RouterModule } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SharedDataService } from '../../../_services/shared-data.service';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { addIcons } from "ionicons";
import { personAddSharp } from "ionicons/icons";
import { IonicModule } from '@ionic/angular';

@Component( {
  selector: 'app-city',
  standalone: true,
  imports: [
    CardListComponent,
    NoRecordsFoundComponent,
    CityListComponent,
    RouterModule,
    NgxPaginationModule,
    IonicModule
  ],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
} )
export class CityComponent implements OnInit, OnDestroy {
  p: number = 1;
  public filter: string = '';
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(
    private cityService: CityService,
    private spinnerVisibilityService: SpinnerVisibilityService,
    private sharedDataService: SharedDataService ) {
    addIcons( { personAddSharp } );
  }
  ngOnDestroy (): void {
    this.cityService.getAll().subscribe().unsubscribe();
  }

  cities: City[] = [];
  message!: string;

  ngOnInit (): void {
    this.sharedDataService.currentCityData.subscribe( data => this.cities = data );
    this.cityService.getAll().subscribe( {
      next: ( data ) => {
        if ( data.StatusCode == 200 ) {
          this.cities = data.Data;
          this.sharedDataService.changeCityData( data.Data );
        } else {
          console.log( "No data found" );
          this.message = data.Message;
        }
        this.spinnerVisibilityService.hide();
      },
      error: () => {
        this.spinnerVisibilityService.hide();
        console.log( 'Error fetching cities' );
      }
    } );
  }
}
