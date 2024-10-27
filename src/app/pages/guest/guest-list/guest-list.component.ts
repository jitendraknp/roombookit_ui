import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Guest } from '../../../models/guest';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import saveAs from 'file-saver';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { InvoiceService } from '../../../_services/invoice.service';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
@Component( {
  selector: 'app-guest-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    RouterModule,
    ButtonModule,
    TooltipModule,
    ImageModule,
    ToastModule,
    CardModule,
    InputTextModule
  ],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
} )
export class GuestListComponent {
  @Input() guestDetails: Guest | undefined;
  showFullList = true;

  constructor(
    private invoiceService: InvoiceService,
    private messageService: MessageService
  ) {

  }
  printInvoice ( id?: string, invoiceNo?: string ) {
    this.invoiceService.generateInvoiceMpci( id!, invoiceNo ).subscribe( {
      next: ( res: any ) => {
        // this.messageService.add( { severity: 'info', summary: 'Downloading', detail: 'Invoice downloading...' } );
        saveAs( res, `${ id }.pdf` );

      },
      error: ( err ) => {
        console.log( err );
      },
      complete: () => {
        this.messageService.add( { severity: 'info', summary: 'Downloaded', detail: 'Invoice downloaded' } );
      }
    } );
  }
  get firstCheckInDate (): string | undefined {
    if ( this.guestDetails?.GuestsStayDetail?.length ) {
      return this.guestDetails.GuestsStayDetail[this.guestDetails.GuestsStayDetail.length - 1].CheckInDate?.toString();
    }
    return 'No Check-In Date Available';
  }

  get firstCheckOutDate (): string | undefined {
    if ( this.guestDetails?.GuestsStayDetail?.length ) {
      return this.guestDetails.GuestsStayDetail[this.guestDetails.GuestsStayDetail.length - 1].CheckOutDate?.toString();
    }
    return 'No Check-Out Date Available';
  }
}
