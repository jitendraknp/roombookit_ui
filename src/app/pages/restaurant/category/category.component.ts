import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';

@Component( {
  selector: 'app-category',
  standalone: true,
  imports: [
    RouterModule,
    ProgressBarModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
} )
export class CategoryComponent {

}
