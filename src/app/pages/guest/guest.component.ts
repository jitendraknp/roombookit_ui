import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router';
import { NoRecordsFoundComponent } from '../no-records-found/no-records-found.component';
import { Guest } from '../../models/guest';
import { GuestListComponent } from "./guest-list/guest-list.component";
import { TooltipDirective } from '../../_directives/tooltip.directive';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { CustomMessageService } from '../../_services/custom-message.service';

@Component( {
  selector: 'app-guest',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    NoRecordsFoundComponent,
    GuestListComponent,
    TooltipDirective,
    NgxPaginationModule,
    NgIf
  ],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css'
} )
export class GuestComponent implements OnInit, OnDestroy {
  onAdd () {
    this.showFullList = false;
  }
  showFullList = true;
  p: number = 1;
  public filter: string = '';
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };
  guests?: Guest[] = [];
  message: string = 'No records found.';
  path: string = '';
  subscription: Subscription;
  constructor( private route: ActivatedRoute, private messageService: CustomMessageService ) {
    this.subscription = this.messageService.getMessage().subscribe( message => {
      this.showFullList = message;
    } );
  }
  ngOnDestroy (): void {
    this.subscription.unsubscribe();
  }
  ngOnInit (): void {
    this.route.data.subscribe( ( { data } ) => {
      this.guests = data.Data;
      this.showFullList = true;
      if ( data.Data === null )
        this.message = data.Message;
    } );
  }

}
