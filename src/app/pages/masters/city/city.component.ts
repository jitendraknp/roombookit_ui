import {Component} from '@angular/core';
import {NoRecordsFoundComponent} from '../../no-records-found/no-records-found.component';
import {RouterModule} from '@angular/router';
import {ProgressBarModule} from "primeng/progressbar";

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [
    NoRecordsFoundComponent,
    RouterModule,
    ProgressBarModule,
  ],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent {

  constructor() {
  }

}
