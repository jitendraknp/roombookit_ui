import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { RestaurantTableService } from '../../../../_services/restaurant/restaurant-table.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { R_Table } from '../../../../models/restaurant/tables';
import { DataService } from '../../../../_services/restaurant/data.service';
import { switchMap } from 'rxjs';
import { UtilsService } from '../../../../_helpers/utils.service';
interface TableStatus {
  name: string;
  code: string;
}
@Component( {
  selector: 'app-edit-rtables',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    CardModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './edit-rtables.component.html',
  styleUrl: './edit-rtables.component.css',
  providers: [MessageService]
} )
export class EditRTablesComponent implements OnInit {
  onClose ( e: any ) {
    e.preventDefault();
    this.router.navigate( ['/restaurant/table'] );
  }

  constructor( private fb: FormBuilder,
    private tableService: RestaurantTableService,
    private messageService: MessageService,
    private utilsService: UtilsService,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute ) {
    this.editTableForm = this.fb.group( {
      Id: new FormControl( '' ),
      TableNumber: new FormControl( '', [Validators.required] ),
      Capacity: new FormControl( 1 ),
      Status: new FormControl<TableStatus | null>( { name: 'Available', code: 'AV' } ),
      Is_Active: new FormControl<Boolean | true>( true ),
    } );
  }
  editTableForm!: FormGroup;
  tableId: string = '';
  tableStatus: TableStatus[] | undefined;
  table!: R_Table;
  ngOnInit (): void {
    this.tableStatus = [
      { name: 'Available', code: 'Available' },
      { name: 'Booked', code: 'Booked' },
      { name: 'Reserved', code: 'Reserved' },
      { name: 'Maintenance', code: 'Maintenance' },
      { name: 'Occupied', code: 'Occupied' },
    ];
    this.editTableForm.controls['Status'].patchValue( this.tableStatus[0].code );

    this.getTable();
  }
  getTable () {
    this.route.params.pipe(
      switchMap( ( params: Params ) => this.tableService.getTableById( params['table-id'] ) )
    ).subscribe( {
      next: ( response ) => {
        if ( response.StatusCode == 200 ) {
          this.table = response.Data as R_Table;
          this.editTableForm.controls['Id'].patchValue( this.table.Id );
          this.editTableForm.controls['TableNumber'].patchValue( this.table.TableNumber );
          this.editTableForm.controls['Is_Active'].patchValue( this.table.Is_Active );
          this.editTableForm.controls['Capacity'].patchValue( this.table.Capacity );
          this.editTableForm.controls['Status'].patchValue( this.table.Status );
        }
        else {
          this.messageService.add( { severity: 'error', summary: 'Error', detail: response.Message } );
        }
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => {
      }
    } );
  }
  updateTable () {
    const invalidControls = this.utilsService.findInvalidControls( this.editTableForm );
    if ( invalidControls.length > 0 ) {
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    const data: R_Table = {
      Id: this.editTableForm.controls['Id'].value == null ? this.table.Id : this.editTableForm.controls['Id'].value,
      TableNumber: this.editTableForm.controls['TableNumber'].value,
      Capacity: this.editTableForm.controls['Capacity'].value,
      Status: this.editTableForm.controls['Status'].value,
      Is_Active: this.editTableForm.controls['Is_Active'].value,
    };
    this.tableService.updateTable( data ).subscribe( {
      next: ( response ) => {
        if ( response.StatusCode == 200 )
          this.messageService.add( { key: 'tUpdateTable', severity: 'success', summary: 'Update', detail: response.Message } );
        else
          this.messageService.add( { key: 'tUpdateTable', severity: 'error', summary: 'Error', detail: response.Message } );
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => { }
    } );
  }
}
