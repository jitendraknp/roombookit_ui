import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-records-found',
  standalone: true,
  imports: [],
  templateUrl: './no-records-found.component.html',
  styleUrl: './no-records-found.component.css'
})
export class NoRecordsFoundComponent {

  @Input() message: string = 'No records found';
}
