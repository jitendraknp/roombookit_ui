import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressBarModule } from "primeng/progressbar";

@Component( {
  selector: 'app-country',
  standalone: true,
  imports: [
    RouterOutlet,
    ProgressBarModule
  ],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css',
  providers: []
} )
export class CountryComponent {
  constructor() {
  }
}
