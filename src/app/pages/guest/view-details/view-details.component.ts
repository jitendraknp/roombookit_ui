import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from "primeng/card";
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { Guest } from '../../../models/guest';
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component( {
  selector: 'app-view-details',
  standalone: true,
  imports: [
    CardModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.css',
  providers: [DatePipe, MessageService],
  encapsulation: ViewEncapsulation.None
} )
export class ViewDetailsComponent implements OnInit {

  @Input() selectedItem: any;
  @Input() guests: Guest[] = [];
  @Output() printInvoice = new EventEmitter<string>();
  cols!: Column[];
  exportColumns!: ExportColumn[];
  ngOnInit (): void {
    this.cols = [
      { field: 'Id', header: 'Id', customExportHeader: 'Id' },
      { field: 'Guests.FL_Name', header: 'Name' },
      { field: 'CheckInDate', header: 'Check-In Date' },
      { field: 'CheckOutDate', header: 'Check-Out Date' },
      { field: 'Guests.Address', header: 'Address' }
    ];
    this.exportColumns = this.cols.map( ( col ) => ( { title: col.header, dataKey: col.field } ) );
  }
  onPrintClick ( id: string, invoiceNo: string ) {
    this.printInvoice.emit( invoiceNo );
  }
}
