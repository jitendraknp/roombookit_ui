import { Component } from '@angular/core';
import { CountryComponent } from '../country/country.component';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { RouterModule } from '@angular/router';
import { NoRecordsFoundComponent } from '../../no-records-found/no-records-found.component';
import { StateListComponent } from './state-list/state-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProgressBarModule } from "primeng/progressbar";

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
    ProgressBarModule
  ]
} )
export class StatesComponent {

  constructor() {
  }

}
