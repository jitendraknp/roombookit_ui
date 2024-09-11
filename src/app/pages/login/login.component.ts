import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../authentication/services/auth.service';
import { StorageService } from '../../_services/storage.service';
import { CommonModule, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuardService } from '../../authentication/services/auth-guard.service';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
@Component( {
  selector: 'app-login:not(p)',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    AuthService,
    AuthGuardService
  ]
} )

// Login component to handle user login functionality
export class LoginComponent implements OnInit {
  isloggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  storageService = inject( StorageService );
  toasterService = inject( ToastrService );
  invalidCredentialMsg = '';
  retUrl = '';
  isUserLogout: any = false;
  constructor( private authService: AuthService, private router: Router, private route: ActivatedRoute, ) {
  }

  get username () {
    return this.loginForm.get( 'username' );
  }
  ngOnInit (): void {
    // this.authService.logoutUser().subscribe((resp) => {
    //   if (resp) {
    //     this.storageService.clean();
    //     this.isUserLogout = resp;
    //     this.router.navigate(['/']);
    //   }
    // });
  }
  loginForm = new FormGroup( {
    username: new FormControl( '', [Validators.required, Validators.minLength( 4 ), Validators.max( 50 )] ),
    password: new FormControl( '', [Validators.required, Validators.minLength( 6 )] )
  } );

  login ( form: FormGroup ): void {
    const returnUrl = this.authService.getRedirectUrl().pipe( map( url => {
      return url;
    } ) );
    returnUrl.subscribe( url => this.retUrl = url );

    if ( form.valid ) {
      this.authService.isUserAuthenticated( form.value ).subscribe(
        authenticated => {
          if ( authenticated ) {
            this.isloggedIn = authenticated;
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.retUrl;
            //this.router.navigate([this.retUrl]);
            this.router.navigateByUrl( returnUrl );
          } else {

            this.invalidCredentialMsg = 'Invalid Credentials. Try again.';
            this.toasterService.error( this.invalidCredentialMsg, 'Error' ).onAction.subscribe( action => {
              this.router.navigate( ['login'], { queryParams: [{ returnUrl: this.retUrl }] } );
            } );
          }
        }
      );
    }
  }
}
