import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../_services/common.service';
import { Roles } from '../../models/role';
import { SetupHotelService } from '../../_services/setup-hotel.service';
import { Hotel } from '../../models/hotel';
import { AdminSetupService } from '../../_services/admin-setup.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';

// Admin setup component to create new admin and manage existing admins
@Component({
  selector: 'app-admin-setup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgSelectModule, RouterModule],
  templateUrl: './admin-setup.component.html',
  styleUrl: './admin-setup.component.css'
})

// Admin setup component to create new admin and manage existing admins
export class AdminSetupComponent implements OnInit {
  roles: Roles[] = [];
  hotels: Hotel[] = [];
  isSuperAdminExists: boolean = false;
  constructor(
    private commonService: CommonService,
    private hotelService: SetupHotelService,
    private setupAdminService: AdminSetupService,
    private toastService: ToastrService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.commonService.getRoles().subscribe({
      next: (data) => {
        this.roles = data.Data;
        console.log(this.roles)
      },
      error: (error) => {
        console.error('Error occurred while getting roles', error);
      }
    });
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data.Data;
      },
      error: (error) => {
        console.error('Error occurred while getting hotels', error);
      }
    });
    this.setupAdminService.getSuperAdmin().subscribe({
      next: (data) => {
        console.log('Super admin fetched', data.Data);
        if (data.Data.length > 0) {
          this.adminSetupForm.controls['hotelId'].patchValue(data.Data[0].HotelId);
          this.adminSetupForm.controls['empCode'].patchValue(data.Data[0].EmpCode);
          this.adminSetupForm.controls['firstName'].patchValue(data.Data[0].FirstName);
          this.adminSetupForm.controls['lastName'].patchValue(data.Data[0].LastName);
          this.adminSetupForm.controls['email'].patchValue(data.Data[0].Email);
          this.adminSetupForm.controls['phoneNo'].patchValue(data.Data[0].PhoneNo);
          this.adminSetupForm.controls['mobileNo'].patchValue(data.Data[0].MobileNo);
          this.adminSetupForm.controls['address'].patchValue(data.Data[0].Address);
          this.adminSetupForm.controls['statusId'].patchValue(data.Data[0].Is_Active);
          this.adminSetupForm.controls['roleId'].patchValue(data.Data[0].RoleId);
          this.adminSetupForm.controls['userName'].patchValue(data.Data[0].UserName);
          this.adminSetupForm.disable();
          this.isSuperAdminExists = true;
        }
      },
      error: (error) => {
        console.error('Error fetching super admin', error);
      }
    });
  }

  // Form Group for admin setup
  adminSetupForm: FormGroup = new FormGroup({
    hotelId: new FormControl(null, [Validators.required]),
    empCode: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNo: new FormControl(''),
    mobileNo: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    statusId: new FormControl(null, [Validators.required]),
    roleId: new FormControl(null, [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.adminSetupForm.valid) {
      this.setupAdminService.setupAdmin(this.adminSetupForm.value).subscribe({
        next: (data) => {
          this.toastService.success('Admin setup successful');

        },
        error: (error) => {
          this.toastService.error('Error occurred while setting up admin');
          console.error('Error occurred while setting up admin', error);
        }
      });
    }
  }
  onSetupCancel() {
    this.router.navigate(['/login']);
  }
}
