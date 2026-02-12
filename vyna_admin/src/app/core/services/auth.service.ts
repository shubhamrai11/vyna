// auth.service.ts
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpService } from './http.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<boolean>(false);

  constructor(public httpService: HttpService, private router: Router,) { }
  // auth.service.ts
  // login(reqObj: any): Observable<any> {
  //   const url = `open/cooperative/immo/api/v1/oauth`;
  //   return this.httpService.postReq(url, reqObj).pipe(
  //     // Ensure the response is caught here to handle errors properly
  //     catchError((error) => {
  //       return throwError(error); // Pass the error to the caller
  //     })
  //   );
  // }
  login(reqObj: any): Observable<any> {
    const url = `admin/login`;
    return this.httpService.postReq(url, reqObj).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log the full error for debugging
        console.error('Login API Error:', error);
  
        // Check if error.error exists and has the expected error description
        let errorMessage = 'An unknown error occurred';
        
        if (error.error) {
          // Extract the error description from the response
          errorMessage = error.error.error_description || error.error.message || 'An unknown error occurred';
        }
  
        // Return the error message to the subscriber
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  


  
  
  


  

  logout(): void {
    localStorage.removeItem('sessionId');
    this.user.next(true);

  }



  
  


  IsLoggedIn(): boolean {
   return !!localStorage.getItem('admin_token');

  }

}
