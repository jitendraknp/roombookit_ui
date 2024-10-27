import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
@Component( {
  selector: 'app-filter-by-days-and-text',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule
  ],
  templateUrl: './filter-by-days-and-text.component.html',
  styleUrl: './filter-by-days-and-text.component.css',
  encapsulation: ViewEncapsulation.None
} )
export class FilterByDaysAndTextComponent implements OnInit {
  @Input() defaultFilter: string = 'today'; // Default filter (optional)
  @Input() defaultSearchText: string = ''; // Default search text (optional)
  @Input() searchFor: string = "";
  @Output() filterApplied: EventEmitter<any> = new EventEmitter<any>(); // Emit filtered data
  filterForm!: FormGroup;
  dateFilterOptions: any[] = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'Custom Date Range', value: 'custom' }
  ];
  constructor( private fb: FormBuilder ) { }
  ngOnInit () {
    this.filterForm = this.fb.group( {
      searchText: [this.defaultSearchText], // Text search field
      dateFilter: [this.defaultFilter], // Date filter dropdown
      startDate: [null], // Start date for custom range
      endDate: [null] // End date for custom range
    } );
  }

  filterByDays () {
    const today = new Date();
    let startDate: Date = today;
    let endDate: Date = today;

    const selectedFilter = this.filterForm.get( 'dateFilter' )?.value;

    switch ( selectedFilter ) {
      case 'today':
        startDate = today;
        endDate = today;
        break;
      case 'last7days':
        startDate = new Date( today.setDate( today.getDate() - 7 ) );
        break;
      case 'last30days':
        startDate = new Date( today.setDate( today.getDate() - 30 ) );
        break;
      case 'custom':
        startDate = this.filterForm.get( 'startDate' )?.value;
        endDate = this.filterForm.get( 'endDate' )?.value;
        break;
    }

    const searchText = this.filterForm.get( 'searchText' )?.value || '';

    this.filterApplied.emit( { startDate, endDate, searchText } );
  }

  onSubmit () {
    this.filterByDays(); // Trigger filter when form is submitted
  }
}
