import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';

@Component( {
  selector: 'app-rtables',
  standalone: true,
  imports: [
    RouterModule,
    ProgressBarModule
  ],
  templateUrl: './rtables.component.html',
  styleUrl: './rtables.component.css'
} )
export class RTablesComponent {

}
