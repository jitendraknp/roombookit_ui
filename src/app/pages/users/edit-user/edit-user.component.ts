import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddressComponent } from '../../../shared/address/address.component';
import { UserService } from '../../../_services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiResponse } from '../../../models/response';
import { User } from '../../../models/user';
import { Observable, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AddressComponent,
    NgSelectModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute,) { }
  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      this.user = user.Data;
      this.editUserForm.patchValue({
        Id: this.user.Id!,
        FirstName: this.user.FirstName!,
        LastName: this.user.LastName!,
        MobileNo: this.user.MobileNo!,
        PinCode: this.user.PinCode!,
        Email: this.user.Email!,
        Address: this.user.Address!,
        EmpCode: this.user.EmpCode!,
        UserName: this.user.UserName!,
        Password: this.user.Password!,
        CountryId: this.user.CountryId,
        CityId: this.user.CityId!,
        StateId: this.user.StateId!,
        Gender: this.user.Gender!,
        RoleId: this.user.RoleId!.toUpperCase(),
        HotelId: '5C953E70-73FE-46CF-0267-08DCB3AA275E'
      });
    });
    // this.route.params.pipe(
    //   switchMap((params: Params) => this.userService.getUserById(params['user-id']))
    // ).subscribe({
    //   next: (result) => {
    //     this.user = result.Data;
    //     this.editUserForm.patchValue({
    //       Id: this.user.Id!,
    //       FirstName: this.user.FirstName!,
    //       LastName: this.user.LastName!,
    //       MobileNo: this.user.MobileNo!,
    //       PinCode: this.user.PinCode!,
    //       Email: this.user.Email!,
    //       Address: this.user.Address!,
    //       EmpCode: this.user.EmpCode!,
    //       UserName: this.user.UserName!,
    //       Password: this.user.Password!,
    //       CountryId: this.user.CountryId,
    //       CityId: this.user.CityId!,
    //       StateId: this.user.StateId!,
    //       Gender: this.user.Gender!,
    //       RoleId: this.user.RoleId!.toUpperCase(),
    //       HotelId: '5C953E70-73FE-46CF-0267-08DCB3AA275E'
    //     });

    //   }, error: () => {
    //   },
    //   complete: () => {
    //   }

    // });

  }
  users: User[] = [];
  user!: User;
  users$!: Observable<ApiResponse>;
  saveUsers$: any;
  onClose() {
    this.router.navigate(['admin/users']);
  }
  onSubmit() {
    this.userService.updateUserDetails(this.editUserForm.value).subscribe({
      next: (data: ApiResponse) => {
        this.users = [...this.users, data.Data];
        this.editUserForm.reset();
        this.toastrService.success(data.Message, 'Success');
        this.router.navigateByUrl('/admin/users').then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  editUserForm = new FormGroup({
    Id: new FormControl('', [Validators.required]),
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    MobileNo: new FormControl('', [Validators.required]),
    PinCode: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required]),
    Address: new FormControl('', [Validators.required]),
    EmpCode: new FormControl('', [Validators.required]),
    UserName: new FormControl('', [Validators.required]),
    Password: new FormControl(''),
    CountryId: new FormControl(null as string | null, [Validators.required]),
    CityId: new FormControl(null as string | null, [Validators.required]),
    StateId: new FormControl(null as string | null, [Validators.required]),
    Gender: new FormControl(null as string | null, [Validators.required]),
    RoleId: new FormControl(null as string | null, [Validators.required]),
    HotelId: new FormControl('5C953E70-73FE-46CF-0267-08DCB3AA275E', [Validators.required]),
  });
}
