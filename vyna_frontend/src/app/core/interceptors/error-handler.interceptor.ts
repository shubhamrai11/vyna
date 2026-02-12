import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { forOwn } from "lodash";
import { catchError, finalize, map } from "rxjs/operators";
import { ErrorHandlerService } from "../services/error-handler.service";
import { ErrorContainer } from "../models/ErrorContainer";
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";


@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  activeRequests: number = 0;

  /**
   * URLs for which the loading should not be enabled
   */
  skippUrls = [
    '/refreshtoken',
  ];

  constructor(private errorHandlerService: ErrorHandlerService, 
    private router: Router,
    private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((errorResponse: HttpErrorResponse) => {

        console.error('The error response ', errorResponse);

        let reason = errorResponse && errorResponse.error && errorResponse.error.reason ? errorResponse.error.reason : '';
        let status = errorResponse.status;

        let errorContainer : ErrorContainer = new ErrorContainer();
        let errors = new Array<string>();
        
        if (status && (status == 400 || status == 500 ) && errorResponse.error.errors 
          && typeof errorResponse.error.errors === 'object') {
          errorContainer.errorMessage = errorResponse.error.message;
          forOwn(errorResponse.error.errors, (value, key) => {
            errors.push(`<b>${key}</b> ${value}`);
          });
        }
        else if (status && status == 401) {
          this.logout();
        }
        else if (errorResponse.error.error) {
          errorContainer.errorMessage = errorResponse.error.error;          
          if (errorResponse.error.message)
            errors.push(errorResponse.error.message);
          if (errorResponse.error.error_description)
            errors.push(errorResponse.error.error_description);
        }
        else if (errorResponse.message) {
          errorContainer.errorMessage = errorResponse.error.name || `Error ${status}`;
          errors.push(errorResponse.message);
        }
        else {
          errorContainer.errorMessage = `Error ${status}`;
          errors.push(errorResponse.message);
        }
        errorContainer.errors = errors;
        errorContainer.status = status || 0;

        this.errorHandlerService.error = errorContainer;
        return throwError(errorContainer);
      }));
  };

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
}

export const ErrorHandlerInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true }
];
