import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { NoRecordsFoundComponent } from '../../../no-records-found/no-records-found.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { FilterByDaysAndTextComponent } from '../../../../shared/filter-by-days-and-text/filter-by-days-and-text.component';
import { SignalRService } from '../../../../_services/common/signal-r.service';
import { map, Subscription } from 'rxjs';
import { R_Table } from '../../../../models/restaurant/tables';
import { RestaurantTableService } from '../../../../_services/restaurant/restaurant-table.service';
import { TableHubRService } from '../../../../_services/restaurant/signalr/table-hub-r.service';
import { TagModule } from 'primeng/tag';
import { DataService } from '../../../../_services/restaurant/data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
@Component( {
  selector: 'app-rtables-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BadgeModule,
    ButtonModule,
    NgxPaginationModule,
    NoRecordsFoundComponent,
    TooltipModule,
    FilterByDaysAndTextComponent,
    AutoCompleteModule,
    CardModule,
    FloatLabelModule,
    PaginatorModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    ConfirmPopupModule
  ],
  templateUrl: './rtables-list.component.html',
  styleUrl: './rtables-list.component.css',
  providers: [MessageService, ConfirmationService,]
} )
export class RTablesListComponent implements OnInit {

  constructor(
    private signalRService: SignalRService,
    private tableHubService: TableHubRService,
    private tableService: RestaurantTableService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dataService: DataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {

  }
  private subscriptions: Subscription[] = [];
  tables: R_Table[] = [];
  tableId: string = '';
  ngOnInit (): void {
    this.loadITables();
    this.subscriptions.push(
      this.tableHubService.addTable$.subscribe( item => {
        this.tables.push( item[0] );
        this.cdr.markForCheck();
      } ),
      this.tableHubService.updateTable$.subscribe( updatedItem => {
        const index = this.tables.findIndex( item => item.Id === updatedItem.Id ); // Adjust 'id' based on your item's unique identifier
        if ( index > -1 ) {
          this.tables[index] = updatedItem;
        } else {
          this.tables.push( updatedItem );
        }
        this.cdr.markForCheck();
      } ),
      this.tableHubService.deleteTable$.subscribe( id => {
        this.tables = this.tables.filter( item => item.Id !== id );
        this.cdr.markForCheck();
      } )
    );
  }
  loadITables () {
    this.tableService.getAllTables().subscribe( {
      next: ( response ) => {
        this.tables = response.Data as R_Table[];
      },
      error: ( error ) => {
      },
      complete: () => {
      }
    } );
  }
  addTable () {
    this.router.navigate( ['/restaurant/table/add'] );
  }

  onEditClick ( id: string | undefined ) {
    this.dataService.setData( this.tableId );
    this.tableId = '';
    this.router.navigate( ['/restaurant/table/edit', id] );
  }
  confirmDelete ( event: Event, id: string | undefined ) {
    this.confirmationService.confirm( {
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.onDelete( id );
      }
    } );
  }
  onDelete ( id: string | undefined ) {
    this.tableService.deleteTable( id ).subscribe( {
      next: ( response ) => {
        if ( response.StatusCode == 200 ) {
          this.messageService.add( { severity: 'success', summary: 'Delete', detail: response.Message } );
        }
        else
          this.messageService.add( { severity: 'error', summary: 'Error', detail: response.Message } );
      },
      error: ( error ) => {
      },
      complete: () => {
      }
    } );
  }
  rowsPerPage = 5;
  currentPage = 0;
  // Getter for paged cities
  get pagedTables () {
    const start = this.currentPage * this.rowsPerPage;
    return this.tables.slice( start, start + this.rowsPerPage );
  }

  onPageChange ( event: any ) {
    this.currentPage = event.page;
  }
}
