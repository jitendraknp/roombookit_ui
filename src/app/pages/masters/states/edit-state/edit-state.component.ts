import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../../../_services/common.service';
import { Country } from '../../../../models/countries';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { States } from '../../../../models/states';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../../_services/shared-data.service';

@Component({
  selector: 'app-edit-state',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './edit-state.component.html',
  styleUrl: './edit-state.component.css'
})
export class EditStateComponent implements OnInit {
  countries: Country[] = [];
  constructor(
    private commonServices: CommonService,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private toasterService: ToastrService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.editStateForm = new FormGroup({
      Id: new FormControl(''),
      Name: new FormControl('', [Validators.required]),
      Code: new FormControl('', [Validators.required]),
      Is_Active: new FormControl(false, [Validators.required]),
      CountryId: new FormControl(null, [Validators.required]),
    });
    this.commonServices.getCountries().subscribe({
      next: (data) => {
        this.countries = data.Data;
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.route.params.pipe(
      switchMap((params: Params) => this.commonServices.getStateById(params['state-id']))
    ).subscribe({
      next: (result) => {
        this.state = result.Data;
        this.setFormValues();
        this.editStateForm.get('Is_Active')?.valueChanges.subscribe(value => {
          this.activeValue = value ? 'Active' : 'In Active';
        });
        if (this.editStateForm.get('Is_Active')?.value) {
          this.editStateForm.get('Is_Active')?.setValue(true);
          this.activeValue = 'Active';
        }
        else {
          this.editStateForm.get('Is_Active')?.setValue(false);
          this.activeValue = 'In Active';
        }
      },
      error: (result) => {
        console.error('Error fetching room details', result);
      }
    });
  }
  states: States[] = [];
  state!: States;
  onCityChange($event: Event) {
    throw new Error('Method not implemented.');
  }
  activeValue: any;
  onClose() {
    this.router.navigate(['admin/state']);
  }
  onSubmit() {
    if (this.editStateForm.valid) {
      this.commonServices.updateState(this.editStateForm.value).subscribe({
        next: (result) => {
          this.states = result.Data;
          this.toasterService.success(result.Message, 'Success');
          this.sharedDataService.changeStateData(this.states);
          this.editStateForm.reset();
          this.onClose();
        },
        error: (error) => {
          console.error('Error occurred while updating state', error);
        }
      });
    }
  }
  editStateForm!: FormGroup;
  setFormValues() {
    this.editStateForm.setValue({
      Id: this.state.Id,
      Name: this.state.Name,
      Code: this.state.Code,
      CountryId: this.state.CountryId,
      Is_Active: this.state.Is_Active
    });
  }
}
