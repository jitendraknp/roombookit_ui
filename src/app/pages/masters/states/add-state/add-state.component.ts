import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Country } from '../../../../models/countries';
import { States } from '../../../../models/states';
import { Router } from '@angular/router';
import { CommonService } from '../../../../_services/common.service';
import { CountryService } from '../../../../_services/country.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-state',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './add-state.component.html',
  styleUrl: './add-state.component.css'
})
export class AddStateComponent implements OnInit {
  constructor(
    private router: Router,
    private commonService: CommonService,
    private countryService: CountryService,
    private toastrService: ToastrService,) { }
  ngOnInit(): void {
    this.countryService.getAll().subscribe(country => {
      this.countries = country.Data;
    });
  }
  countries: Country[] = [];
  states: States[] = [];
  stateForm = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Code: new FormControl('', [Validators.required]),
    CountryId: new FormControl(null, [Validators.required]),
    Is_Active: new FormControl(true),
  });
  onCityChange($event: any) {
    // throw new Error('Method not implemented.');
  }
  onClose() {
    this.router.navigate(['admin/state']);
  }
  onSubmit() {
    console.log(this.stateForm.value)
    if (this.stateForm.valid) {
      this.commonService.saveState(this.stateForm.value).subscribe({
        next: (data) => {
          if (data.StatusCode === 200) {
            this.toastrService.success('Country added successfully', 'Success').onAction.subscribe(() => {
              this.router.navigateByUrl('/admin/state').then(() => {
                window.location.reload();
              });
            });
            // this.router.navigate(['admin/state']);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.router.navigate(['admin/state']);
        }
      });
    }
  }


}
