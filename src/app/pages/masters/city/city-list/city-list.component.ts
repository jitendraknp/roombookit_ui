import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { City } from '../../../../models/cities';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BadgeModule } from "primeng/badge";
import { Button } from "primeng/button";
import { NgxPaginationModule } from "ngx-pagination";
import { NoRecordsFoundComponent } from "../../../no-records-found/no-records-found.component";
import { TooltipModule } from "primeng/tooltip";
import { CityService } from "../../../../_services/city.service";

@Component( {
  selector: 'app-city-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BadgeModule,
    Button,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    TooltipModule,

  ],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css'
} )
export class CityListComponent implements OnInit {
  p: number = 1;
  cities: City[] = [];
  @Output() isVisible: boolean = false;

  constructor(
    private cityService: CityService,
    private cd: ChangeDetectorRef,
    private router: Router,
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
}
