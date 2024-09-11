import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { HandleErrorService } from '../server_error/handle-error.service';
@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {
  constructor(
    private error: HandleErrorService,
  ) { }
  // intercept function
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpErrorResponse) {
            // Handle successful responses
            console.log('Response:', event);
          }
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            // Handle errors
            console.log('Error:', error);
            this.error.handleError(error);
          }
        }
      )
    );
  }
}