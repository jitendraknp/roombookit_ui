import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { City } from '../../../../models/cities';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from "ionicons";

@Component( {
  selector: 'app-city-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

  ],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css'
} )
export class CityListComponent implements OnInit {
  constructor() { }
  ngOnInit (): void {
    // this.sharedDataService.currentCityData.subscribe((data) => {
    //   this.cityDetails = data;
    // });
  }

  toggleStatus ( arg0: any ) {

  }
  @Input() cityDetail!: City;
  @Input() cityDetails: City[] = [];
}
