import { Component, Input, OnInit } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { PrimeIcons } from 'primeng/api';
import { CommonModule } from '@angular/common';
@Component( {
  selector: 'app-no-records-found',
  standalone: true,
  imports: [
    CommonModule,
    IconFieldModule,

  ],
  templateUrl: './no-records-found.component.html',
  styleUrl: './no-records-found.component.css'
} )
export class NoRecordsFoundComponent {

  @Input() message: string = 'No records found';
}
