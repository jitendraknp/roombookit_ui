import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';

@Component( {
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    RouterModule,
    ProgressBarModule
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.css'
} )
export class MenuItemsComponent {

}
