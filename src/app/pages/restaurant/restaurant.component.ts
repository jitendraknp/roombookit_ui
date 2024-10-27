import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';

@Component( {
  selector: 'app-restaurant',
  standalone: true,
  imports: [
    RouterModule,
    ProgressBarModule
  ],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
} )
export class RestaurantComponent {

}
