import { Inject, Injectable, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { AuthService } from "../../authentication/services/auth.service";
import { MessageService } from 'primeng/api';
@Injectable( {
  providedIn: 'root',

} )
export class HandleErrorService {
  constructor( private toastrs: ToastrService, private authService: AuthService, private router: Router, private messageService: MessageService ) { }
  // Handling HTTP Errors using Toaster
  public handleError ( err: HttpErrorResponse ) {
    let errorMessage: string;
    if ( err.error instanceof ErrorEvent ) {

      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${ err.error.message }`;
    } else {
      // The backend returned an unsuccessful response code.
      // The backend returned an unsuccessful response code.

      switch ( err.status ) {
        case 400:
          errorMessage = "Bad Request.";
          break;
        case 401:
          errorMessage = "You need to log in to do this action.";
          break;
        case 403:
          errorMessage = "You don't have permission to access the requested resource.";
          break;
        case 404:
          errorMessage = "The requested resource does not exist.";
          break;
        case 412:
          errorMessage = "Precondition Failed.";
          break;
        case 500:
          errorMessage = "Internal Server Error.";
          break;
        case 503:
          errorMessage = "The requested service is not available.";
          break;
        case 422:
          errorMessage = "Validation Error!";
          break;
        case 0:
          errorMessage = 'Network or CORS error detected';
          break;
        default:
          errorMessage = "Something went wrong!";
      }
    }
    console.log( errorMessage );
    this.messageService.add( { severity: 'error', summary: 'Error', detail: 'Message Content' } );

    this.toastrs.error( errorMessage );
    if ( err.status === 401 ) {
      this.router.navigate( ['login'], {
        queryParams: this.authService.getRedirectUrl().subscribe( url => {
          return url;
        } )
      } );
    }
  }
}
