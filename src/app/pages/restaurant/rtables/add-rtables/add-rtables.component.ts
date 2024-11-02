import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { RestaurantTableService } from '../../../../_services/restaurant/restaurant-table.service';
import { R_Table } from '../../../../models/restaurant/tables';
import { SignalRService } from '../../../../_services/common/signal-r.service';
import { map } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { UtilsService } from '../../../../_helpers/utils.service';
interface TableStatus {
  name: string;
  code: string;
}
@Component( {
  selector: 'app-add-rtables',
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
  templateUrl: './add-rtables.component.html',
  styleUrl: './add-rtables.component.css',
  providers: [MessageService]
} )
export class AddRTablesComponent implements OnInit {

  addTableForm!: FormGroup;
  tableStatus: TableStatus[] | undefined;

  constructor( private fb: FormBuilder,
    private tableService: RestaurantTableService,
    private signalRService: SignalRService,
    private messageService: MessageService,
    private utilsService: UtilsService,
    private router: Router ) {
    this.addTableForm = this.fb.group( {
      TableNo: new FormControl( '', [Validators.required] ),
      Capacity: new FormControl( 1 ),
      Status: new FormControl<TableStatus | null>( { name: 'Available', code: 'AV' } ),
      Is_Active: new FormControl<Boolean | true>( true ),
    } );
  }
  ngOnInit (): void {
    this.tableStatus = [
      { name: 'Available', code: 'Available' },
      { name: 'Booked', code: 'Booked' },
      { name: 'Reserved', code: 'Reserved' },
      { name: 'Maintenance', code: 'Maintenance' },
      { name: 'Occupied', code: 'Occupied' },
    ];
    this.addTableForm.controls['Status'].patchValue( this.tableStatus[0].code );

  }
  onSubmit () {
    const invalidControls = this.utilsService.findInvalidControls( this.addTableForm );
    if ( invalidControls.length > 0 ) {
      this.messageService.add( { severity: 'error', summary: 'Required Fields', detail: invalidControls.join( ', ' ) } );
      return;
    }
    const data: R_Table = {
      // Id: null,
      TableNumber: this.addTableForm.controls['TableNo'].value,
      Capacity: this.addTableForm.controls['Capacity'].value,
      Status: this.addTableForm.controls['Status'].value,
      Is_Active: this.addTableForm.controls['Is_Active'].value,
    };

    this.tableService.addTables( data ).subscribe( {
      next: ( response ) => {
        if ( response.StatusCode == 200 )
          this.messageService.add( { severity: 'success', summary: 'Saved', detail: response.Message } );
        else if ( response.StatusCode == 400 )
          this.messageService.add( { severity: 'error', summary: 'Error', detail: response.Message } );
      },
      error: ( error ) => {
        console.log( error );
      },
      complete: () => { }
    } );
  }
  onClose ( e: any ) {
    e.preventDefault();
    this.router.navigate( ['/restaurant/table'] );
  }
}
