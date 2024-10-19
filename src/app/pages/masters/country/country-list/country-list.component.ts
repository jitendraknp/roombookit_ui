import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { BadgeModule } from "primeng/badge";
import { Button } from "primeng/button";
import { CommonService } from "../../../../_services/common.service";
import { Country } from "../../../../models/countries";
import { NgxPaginationModule } from "ngx-pagination";
import { NoRecordsFoundComponent } from "../../../no-records-found/no-records-found.component";
import { CardListComponent } from "../../../../shared/card-list/card-list.component";
import { TooltipModule } from "primeng/tooltip";
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component( {
  selector: 'app-country-list',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    Button,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    CardListComponent,
    TooltipModule
  ],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css'
} )
export class CountryListComponent implements OnInit {
  countries: Country[] = [];
  p: number = 1;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private commonServices: CommonService,
  ) {

  }

  ngOnInit (): void {
    this.commonServices.getCountries().subscribe( {
      next: ( data ) => {
        this.countries = data.Data as Country[];
        this.cd.detectChanges();
      },
      error: ( error ) => {
        console.error( 'Error getting countries', error );
      }
    } );
  }

  addCountry () {
    this.router.navigate( ['/country/add'] );
  }

  onCountryEdit ( id: string ) {
    this.router.navigate( ['country/edit', id] );
  }
}
