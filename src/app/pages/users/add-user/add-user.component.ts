import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressComponent } from '../../../shared/address/address.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../../../_services/user.service';
import { Observable, startWith, takeUntil } from 'rxjs';
import { ApiResponse } from '../../../models/response';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { addIcons } from "ionicons";
import { close } from "ionicons/icons";
import { IonicModule } from '@ionic/angular';

@Component( {
  selector: 'app-add-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AddressComponent,
    NgSelectModule,
    TimepickerModule,
    BsDatepickerModule,
    IonicModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
} )
export class AddUserComponent implements OnInit, OnDestroy {
  constructor( private userService: UserService, private toastrService: ToastrService, private router: Router ) {
    addIcons( { close } );
  }
  ngOnDestroy (): void {
    // this.users$.subscribe().unsubscribe();
  }
  users: User[] = [];
  user!: User;
  users$!: Observable<ApiResponse>;
  saveUsers$: any;

  ngOnInit (): void {

  }
  onClose () {
    this.router.navigate( ['admin/users'] );
  }
  onSubmit () {
    this.userService.saveUserDetails( this.userForm.value ).subscribe( {
      next: ( data: ApiResponse ) => {
        this.users = [...this.users, data.Data];
        this.userForm.reset();
        console.log( this.users );
      },
      error: ( error ) => {
        console.error( error );
      }
    } );
  }
  userForm = new FormGroup( {
    FirstName: new FormControl( '', [Validators.required] ),
    LastName: new FormControl( '', [Validators.required] ),
    EmpCode: new FormControl( '', [Validators.required] ),
    MobileNo: new FormControl( '', [Validators.required] ),
    PinCode: new FormControl( '', [Validators.required] ),
    Email: new FormControl( '', [Validators.required] ),
    Address: new FormControl( '', [Validators.required] ),
    UserName: new FormControl( '', [Validators.required] ),
    Password: new FormControl( '', [Validators.required] ),
    CountryId: new FormControl( null, [Validators.required] ),
    CityId: new FormControl( null, [Validators.required] ),
    StateId: new FormControl( null, [Validators.required] ),
    Gender: new FormControl( null, [Validators.required] ),
    RoleId: new FormControl( null, [Validators.required] ),
    HotelId: new FormControl( '5C953E70-73FE-46CF-0267-08DCB3AA275E', [Validators.required] ),
  } );

}
