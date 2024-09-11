import { Inject, Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, shareReplay } from 'rxjs/operators';
import { User } from './users';
import { StorageService } from '../../_services/storage.service';
import { RSAHelperService } from '../../_services/rsahelper.service';
import { LoginModel } from '../../models/login';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../models/response';
import { ToastrService } from 'ngx-toastr';

const USERS = [
  new User( '1', 'mahesh', 'm123', 'ADMIN' ),
  new User( '2', 'krishna', 'k123', 'USER' )
];
let usersObservable = of( USERS );

@Injectable( {
  providedIn: 'root'

} )
export class AuthService {
  private redirectUrl: string = 'admin/dashboard';
  private loginUrl: string = '/login';
  private isloggedIn: boolean = false;
  private loggedInUser = {} as User;
  httpClient = inject( HttpClient );
  private toastrService = inject( ToastrService );
  baseUrl = 'http://localhost:21309/api/users';

  constructor(
    private storageService: StorageService,
    private rsaHelper: RSAHelperService ) {
  }

  rsaLogin ( user: LoginModel ): Observable<ApiResponse> {
    const encUser: LoginModel = {
      username: this.rsaHelper.encryptWithPublicKey( user.username ),
      password: this.rsaHelper.encryptWithPublicKey( user.password ),
    };
    return this.httpClient.post<ApiResponse>( `${ this.baseUrl }/rsa-login`, encUser ).pipe( shareReplay(), retry( 0 ), catchError( this.handleError ) );
  }
  getAllUsers () {
    return usersObservable;
  }

  isUserAuthenticated ( user: LoginModel ): Observable<boolean> {
    return this.rsaLogin( user ).pipe(
      map( users => {
        let user = users.Data;
        if ( user ) {
          this.isloggedIn = true;
          this.loggedInUser = user;
          this.storageService.saveUser( users );
        } else {
          this.isloggedIn = false;
        }
        return this.isloggedIn;
      } ) );
  }
  isUserLoggedIn (): Observable<boolean> {
    return of( this.storageService.isLoggedIn() );
  }
  getRedirectUrl (): Observable<string> {
    return of( this.redirectUrl );
  }
  setRedirectUrl ( url: string ): void {
    this.redirectUrl = url;
  }
  getLoginUrl (): string {
    return this.loginUrl;
  }
  getLoggedInUser (): Observable<User> {
    return of( this.storageService.getUser() );
  }
  logoutUser (): Observable<boolean> {
    return this.logout();

  }
  isLogOut$!: Observable<boolean>;
  isLogOut!: Observable<boolean>;
  private logout (): Observable<boolean> {
    return this.httpClient.post<boolean>( `${ this.baseUrl }/logout`, null );
  }
  private handleError ( error: HttpErrorResponse ) {

    if ( error.status === 0 ) {
      console.log( 'An error occurred:', error.error );
    }
    else {

      console.log( `Backend returned code ${ error?.status }, body was: `, error?.error );
      //return throwError(() => new Error(error.error));
      // this.toastService?.error(error?.error, 'back');
    }
    console.log( error );
    // console.log(toastrService);
    // this.toastService.error(error?.message, 'back');
    return throwError( () => new Error( 'Something bad happened; please try again later.' ) );
  }
}
