import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Country } from '../../../../models/countries';
import { switchMap } from 'rxjs';
import { CountryService } from '../../../../_services/country.service';
import { ToastrService } from 'ngx-toastr';
import { CardListComponent } from '../../../../shared/card-list/card-list.component';
import { SharedDataService } from '../../../../_services/shared-data.service';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-edit-country',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './edit-country.component.html',
  styleUrl: './edit-country.component.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class EditCountryComponent implements OnInit {
  @Output() isRecordUpdated = new EventEmitter<boolean>();
  onActiveChange($event: Event) {
    this.editCountryForm.get('Is_Active')?.valueChanges.subscribe(value => {
      this.activeValue = value ? 'Active' : 'In Active';
    });
    // const inputElement = $event.target as HTMLInputElement;
    // this.isChecked = inputElement.checked;
    // console.log('Checkbox checked:', this.isChecked);


  }
  editCountryForm!: FormGroup;
  country!: Country;
  countries: Country[] = [];
  activeValue: string = 'Active';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
    private toasterService: ToastrService,
    private sharedDataService: SharedDataService,
    private commonService: CommonService
  ) {

  }

  ngOnInit(): void {
    this.editCountryForm = new FormGroup({
      Id: new FormControl(''),
      Name: new FormControl('', [Validators.required]),
      Code: new FormControl('', [Validators.required]),
      Is_Active: new FormControl(false, [Validators.required]),
    });
    this.route.params.pipe(
      switchMap((params: Params) => this.countryService.getCountryById(params['country-id']))
    ).subscribe({
      next: (result) => {
        this.country = result.Data;
        this.setFormValues();
        this.editCountryForm.get('Is_Active')?.valueChanges.subscribe(value => {
          this.activeValue = value ? 'Active' : 'In Active';
        });
        // this.toasterService.success('Country updated successfully.', 'Success');
      },
      error: (result) => {
        console.error('Error fetching room details', result);
      }
    });

  }
  setFormValues() {
    this.editCountryForm.setValue({
      Id: this.country.Id,
      Name: this.country.Name,
      Code: this.country.Code,
      Is_Active: this.country.Is_Active
    });
    this.activeValue = this.country.Is_Active ? 'Active' : 'In Active';
  }
  onClose() {
    this.router.navigate(['admin/country']);
  }
  onSubmit() {
    if (this.editCountryForm.valid) {
      this.countryService.updateCountry(this.editCountryForm.value).subscribe({
        next: (data) => {
          if (data.StatusCode === 200) {
            const c$ = this.commonService.getCountries();
            c$.subscribe((data) => {
              this.countries = data.Data;
              this.sharedDataService.changeData(data.Data);
            })
            this.editCountryForm.get('Is_Active')?.valueChanges.subscribe(value => {
              this.activeValue = value ? 'Active' : 'In Active';
            });
            this.country = data.Data;
            this.isRecordUpdated.emit(true);
            this.toasterService.success(data.Message, 'Success');

          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
