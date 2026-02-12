import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorContainer } from '../models/ErrorContainer';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('admin_token');

   // console.log("Admingettoken",authToken);
    
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      //return next.handle(authReq);

      return next.handle(authReq).pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 401) {
            
            let errorContainer : ErrorContainer = new ErrorContainer();
            let errors = new Array<string>();
    
            errorContainer.errorMessage = "Expiration de votre session utilisateur."
            errors.push("Votre session de connexion a expiré pour des raisons de sécurité.");
            errors.push("Veuillez vous authentifier à nouveau pour accéder à votre esapce de travail.");
    
            //this.errorHandlerService.errorAuth = errorContainer;
            this.authService.logout();
          }
          // return throwError(error);
          return next.handle(authReq);
        })
      );
    }
    return next.handle(req);
  }
}
