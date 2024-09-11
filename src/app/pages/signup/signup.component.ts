import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../authentication/services/auth.service';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  /**
   *
   */
  constructor(private _formBuilder: FormBuilder) {


  }
  firstFormGroup = this._formBuilder.group({
    firstCtrl: new FormControl(''),
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;
  authService = inject(AuthService);
  router = inject(Router);
  public signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  public onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      //   this.authService.signup(this.signupForm.value)
      //     .subscribe({
      //       next: (data: any) => {
      //         console.log(data);
      //         this.router.navigate(['/login']);
      //       },
      //       error: (err) => console.log(err)
      //     });
      // }
    }
  }
}
