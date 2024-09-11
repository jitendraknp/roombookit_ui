import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(StorageService).getUser()?.Data?.Token;
  const toastrService = inject(ToastrService);
  // Clone the request to add the authentication header.
  const newReq = req.clone(
    {
      setHeaders: { Authorization: `Bearer ${authToken}` }
    });
  // Log the request
  return next(newReq).pipe(
    catchError((err: any) => { // Remove caught: HttpResponse
      if (err instanceof HttpErrorResponse) {
        // Handle HTTP errors
        if (err.status === 401) {

          // toastrService.error(err.message);
          // Specific handling for unauthorized errors         
          console.error('Unauthorized request:', err);
          return throwError(() => err);
          // You might trigger a re-authentication flow or redirect the user here
        } else {
          // Handle other HTTP error codes
          console.error('HTTP error:', err);
        }
      } else {
        // Handle non-HTTP errors
        console.error('An error occurred:', err);
      }

      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};
