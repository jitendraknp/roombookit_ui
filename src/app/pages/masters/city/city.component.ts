import { Component } from '@angular/core';
import { NoRecordsFoundComponent } from '../../no-records-found/no-records-found.component';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from "primeng/progressbar";
import { CardModule } from "primeng/card";

@Component( {
  selector: 'app-city',
  standalone: true,
  imports: [
    NoRecordsFoundComponent,
    RouterModule,
    ProgressBarModule,
    CardModule
  ],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
} )
export class CityComponent {

  constructor() {
  }

}
