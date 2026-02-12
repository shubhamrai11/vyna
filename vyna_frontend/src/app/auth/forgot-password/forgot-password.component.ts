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
  
   
   
  
    this.UsersService.forgotpassword(this.forgotForm.value.email).subscribe(
      (data: any) => {
        if (data) {
       console.log('========error======',data);
       this.snackBar.open(data.message, 'ok', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['green-snackbar']
      });
        }
      },
      (error: Error) => {
       // console.log('=======error--',error)
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
