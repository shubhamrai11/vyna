import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: any;
  isSubmited: boolean = false;
  constructor(
     private UsersService: UsersService,
        private formBuilder: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }


  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.isSubmited = true; // Disable button
  
   let payload ={
    email:this.forgotForm.value.email
   }
   
  
 this.UsersService.forgotpassword(payload).subscribe(
  (data: any) => {
    console.log('========response======', data);

    if (data?.status === 'success') {
      this.snackBar.open(data.message, 'OK', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['green-snackbar']
      });
    } else {
      this.snackBar.open(data.message || 'Something went wrong', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['red-snackbar']
      });
    }
  },
  (error: any) => {
    this.isSubmited = false;
    console.log('=======error--', error);
    this.snackBar.open(error?.error?.message || 'Something went wrong', 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar']
    });
  }
);

  }
 
}
