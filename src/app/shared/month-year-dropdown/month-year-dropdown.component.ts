import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {Button} from "primeng/button";
import { FocusTrapModule } from 'primeng/focustrap';
@Component({
  selector: 'app-month-year-dropdown',
  templateUrl: './month-year-dropdown.component.html',
  standalone: true,
  styleUrls: ['./month-year-dropdown.component.css'],
  imports: [
    DropdownModule,
    FormsModule,
    NgClass,
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    Button,
    FocusTrapModule
  ]
})
export class MonthYearDropdownComponent {
  @Input() selectedMonth: number | null = null;
  @Input() selectedYear: number | null = null;
  @Output() monthChange = new EventEmitter<number>();
  @Output() yearChange = new EventEmitter<number>();
  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();

  months: any[];
  years: any[];
  // selectedMonth: string | null = null;
  // selectedYear: number | null = null;
  formSubmitted: boolean = false;

  constructor() {
    // Months dropdown options
    this.months = [
      { label: 'January', value: 0 },
      { label: 'February', value: 1 },
      { label: 'March', value: 2 },
      { label: 'April', value: 3 },
      { label: 'May', value: 4 },
      { label: 'June', value: 5 },
      { label: 'July', value: 6},
      { label: 'August', value: 7 },
      { label: 'September', value: 8 },
      { label: 'October', value: 9 },
      { label: 'November', value: 10 },
      { label: 'December', value: 11 },
    ];

    // Generate a range of years dynamically
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.selectedMonth=currentMonth;
    this.years = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
      this.years.push({ label: i.toString(), value: i });
    }
  }
  onMonthSelect() {
    this.monthChange.emit(this.selectedMonth!);
  }

  onYearSelect() {
    this.yearChange.emit(this.selectedYear!);
  }
  // On form submit
  onSubmit() {
    this.formSubmitted = true;
    if (this.selectedMonth && this.selectedYear) {
      alert(`Selected Month: ${this.selectedMonth}, Selected Year: ${this.selectedYear}`);
    } else {
      console.log('Please select both month and year');
    }
  }
  generateGstReport() {
    this.buttonClicked.emit();
  }
}
