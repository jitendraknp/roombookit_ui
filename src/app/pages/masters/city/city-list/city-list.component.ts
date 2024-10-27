import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { City } from '../../../../models/cities';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BadgeModule } from "primeng/badge";
import { Button, ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { AutoCompleteModule } from "primeng/autocomplete";
import { NgxPaginationModule } from "ngx-pagination";
import { NoRecordsFoundComponent } from "../../../no-records-found/no-records-found.component";
import { TooltipModule } from "primeng/tooltip";
import { FloatLabelModule } from 'primeng/floatlabel';
import { CityService } from "../../../../_services/city.service";
import { FilterByDaysAndTextComponent } from '../../../../shared/filter-by-days-and-text/filter-by-days-and-text.component';
import { SearchService } from '../../../../_services/search.service';
import { CommonService } from '../../../../_services/common.service';

@Component( {
  selector: 'app-city-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BadgeModule,
    ButtonModule,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    TooltipModule,
    FilterByDaysAndTextComponent,
    AutoCompleteModule,
    CardModule,
    FloatLabelModule
  ],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css',
  encapsulation: ViewEncapsulation.None,
} )
export class CityListComponent implements OnInit {
  p: number = 1;
  cities: City[] = [];
  @Output() isVisible: boolean = false;
  filteredCities: City[] = [];
  selectedCity!: City;
  constructor(
    private cityService: CityService,
    private commonService: CommonService,
    private searchService: SearchService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {

  }

  ngOnInit (): void {
    this.cityService.getAll().subscribe( {
      next: ( data ) => {
        if ( data.StatusCode == 200 ) {
          this.cities = data.Data as City[];

        } else {
          console.log( "No data found" );
        }
        this.cd.detectChanges();
      },
      error: () => {
        console.log( 'Error fetching cities' );
      }
    } );

  }

  onCityEdit ( id: string ) {
    this.router.navigate( ['/city/edit', id] );
  }

  addCity () {
    this.router.navigate( ['/city/add'] );
  }
  applyFilter ( filterData: { startDate: Date; endDate: Date; searchText: string; } ) {
    console.log( filterData.searchText );
  }
  // Autocomplete city
  filterCities ( event: any ) {
    const query = event.query;
    console.log( event );

    this.searchService.searchCityByName( query ).subscribe( {
      next: ( response ) => {

        this.filteredCities = response.Data as City[];
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {

      }
    } );
  }
  onCitySelect ( event: any ) {
    this.cities = [];
    // Handle the selected item
    this.selectedCity = event.value; // Capture the selected city
    this.commonService.getAllCityById( this.selectedCity.Id ).subscribe( {
      next: ( response ) => {
        if ( response.StatusCode == 200 ) {
          this.cities = response.Data as City[];
        }
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => { }
    } );
    console.log( 'Selected City:', this.selectedCity );
  }
  onClearCity () {
    this.cityService.getAll().subscribe( {
      next: ( data ) => {
        if ( data.StatusCode == 200 ) {
          this.cities = data.Data as City[];

        } else {
          console.log( "No data found" );
        }
        this.cd.detectChanges();
      },
      error: () => {
        console.log( 'Error fetching cities' );
      }
    } );
  }
}
