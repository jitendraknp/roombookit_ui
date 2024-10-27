import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
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
