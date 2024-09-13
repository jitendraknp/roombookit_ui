import { Component, Input } from '@angular/core';
import { Guest } from '../../../models/guest';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MessageService } from '../../../_services/message.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { GuestService } from '../../../_services/guest.service';
import { error } from 'console';
import { Toast, ToastrService } from 'ngx-toastr';
import saveAs from 'file-saver';
@Component( {
  selector: 'app-guest-list',
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    ButtonModule,
    TooltipModule

  ],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
} )
export class GuestListComponent {
  @Input() guestDetails: Guest | undefined;
  showFullList = true;
  subscription: Subscription;
  constructor( private messageService: MessageService,
    private guestService: GuestService,
    private toast: ToastrService
  ) {
    this.subscription = this.messageService.getMessage().subscribe( message => {
      this.showFullList = message;
      console.log( message );
    } );
  }
  printInvoice ( id?: string ) {
    this.guestService.generateInvoice( id! ).subscribe( {
      next: ( res: any ) => {
        this.toast.success( 'Invoice downloading...', '' );
        saveAs( res, `${ id }.pdf` );
        this.toast.success( 'Invoice downloaded', '' );
      },
      error: ( err ) => {
        console.log( err );
      },
      complete: () => {

      }
    } );
  }
}
