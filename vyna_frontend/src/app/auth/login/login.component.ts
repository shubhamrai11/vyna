import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {  AfterViewInit, Renderer2, ViewEncapsulation } from '@angular/core';

import { catchError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
// import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
declare var $: any; // For jQuery

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.Emulated, // Ensures CSS is isolated

})
export class LoginComponent implements OnInit {
  isLoading = true; 
  loginForm: any;
  apiUrl: any;
  fieldTextTypeone: boolean = false;
  loading: any;
  url = environment.mediaUrl;
  isSubmited: boolean = false;
  constructor(
    private authservice: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
  ) {
    if (this.authservice.IsLoggedIn()) {
      this.router.navigate(['pages']);
    }
  }

  ngOnInit(): void {
  
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  toggleFieldTextTypeone() {
    this.fieldTextTypeone = !this.fieldTextTypeone;
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isSubmited = true; // Disable button
  
    let reqObj = new FormData();
    reqObj.append('username', this.loginForm.value.email);
    reqObj.append('password', this.loginForm.value.password);
    reqObj.append('grant_type', 'password');
  
    this.authservice.login(reqObj).subscribe(
      (data: any) => {
        if (data) {
          const token = data?.access_token;
          const expiresIn = data?.expires_in; // Duration in seconds
       //  console.log('==========data.===',data)
          if (token && expiresIn) {
            // Save token and expiration time in localStorage
            const expirationTime = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
            localStorage.setItem('admin_token', token);
            localStorage.setItem('userId',data?.accountId);
            localStorage.setItem('profile',data?.profile);
            localStorage.setItem('expirationTime', expirationTime.toString());
            localStorage.setItem('username',data?.accountFirstName + ' - ' + data?.accountLastName);
            localStorage.setItem('userEmail',data?.accountEmail);
  
            // Show success message
            this.snackBar.open('Login Successfully', 'ok', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['green-snackbar']
            });
  
            this.isSubmited = false;
            this.router.navigate(['pages', 'dashboard']);
          } else {
            this.isSubmited = false;
            this.snackBar.open('Unexpected response format', 'ok', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['red-snackbar']
            });
          }
        }
      },
      (error: Error) => {
        this.isSubmited = false;
        this.snackBar.open(error.message, 'ok', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });
      }
    );
  }
 

  
  

}
