import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { States } from '../../../../models/states';
import { CommonService } from '../../../../_services/common.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { City } from '../../../../models/cities';
import { switchMap } from 'rxjs';
import { CityService } from '../../../../_services/city.service';
import { SharedDataService } from '../../../../_services/shared-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-city',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './edit-city.component.html',
  styleUrl: './edit-city.component.css'
})
export class EditCityComponent implements OnInit {
  editCityForm!: FormGroup;
  @Input() city!: City;
  cities: City[] = [];
  activeValue: string = 'Active';
  constructor(
    private commonServices: CommonService,
    private cityService: CityService,
    private router: Router,
    private sharedDataService: SharedDataService,
    private toasterService: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.editCityForm = new FormGroup({
      Id: new FormControl(''),
      Name: new FormControl('', [Validators.required]),
      Code: new FormControl('', [Validators.required]),
      Is_Active: new FormControl(false, [Validators.required]),
      StateId: new FormControl(null, [Validators.required]),
    });
    this.commonServices.getAllStates().subscribe({
      next: (data) => {
        this.states = data.Data;
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.route.params.pipe(
      switchMap((params: Params) => this.commonServices.getCityById(params['city-id']))
    ).subscribe({
      next: (result) => {
        this.city = result.Data;
        this.setFormValues();
        this.editCityForm.get('Is_Active')?.valueChanges.subscribe(value => {
          this.activeValue = value ? 'Active' : 'In Active';
        });
        if (this.editCityForm.get('Is_Active')?.value) {
          this.editCityForm.get('Is_Active')?.setValue(true);
          this.activeValue = 'Active';
        }
        else {
          this.editCityForm.get('Is_Active')?.setValue(false);
          this.activeValue = 'In Active';
        }
      },
      error: (result) => {
        console.error('Error fetching room details', result);
      }
    });
  }
  states: States[] = [];
  onClose() {
    this.router.navigate(['admin/city']);
  }
  onSubmit() {
    if (this.editCityForm.valid) {
      this.cityService.update(this.editCityForm.value).subscribe({
        next: (result) => {
          this.cities = result.Data;
          console.log(this.cities)
          this.sharedDataService.changeCityData(this.cities);
          this.toasterService.success(result.Message, 'Success');

          this.router.navigateByUrl('/admin/city').then(() => {
            // window.location.reload();
          });
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
  onCityChange($event: any) {
    throw new Error('Method not implemented.');
  }
  setFormValues() {
    this.editCityForm.setValue({
      Id: this.city.Id,
      Name: this.city.Name,
      Code: this.city.Code,
      StateId: this.city.StateId,
      Is_Active: this.city.Is_Active
    });
  }
}
