import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-month-dropdown',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule
  ],
  templateUrl: './month-dropdown.component.html',
  styleUrl: './month-dropdown.component.css'
})
export class MonthDropdownComponent {
  months!: any[];
  selectedMonth: any;
  constructor() {
    this.months = [
      { name: 'January', value: 1 },
      { name: 'February', value: 2 },
      { name: 'March', value: 3 },
      { name: 'April', value: 4 },
      { name: 'May', value: 5 },
      { name: 'June', value: 6 },
      { name: 'July', value: 7 },
      { name: 'August', value: 8 },
      { name: 'September', value: 9 },
      { name: 'October', value: 10 },
      { name: 'November', value: 11 },
      { name: 'December', value: 12 }
    ];
    this.selectedMonth = null;
  }
  onMonthChange(event: any) {
    console.log('Selected Month:', this.selectedMonth);
  }
}
