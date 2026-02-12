import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmation = control.get('confirmation');
    return password && confirmation && password.value !== confirmation.value
      ? { passwordMismatch: true }
      : null;
  };
}


export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8 && value.length <= 16;

    const valid =
      hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;

    return valid ? null : { strongPassword: true };
  };
}
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  isLoading = true;
  token: any
  changePasswordForm: any;
  apiUrl: any;
  fieldTextTypeone: boolean = false;
  fieldTextTypeone1: boolean = false;

  loading: any;
  isSubmited: boolean = false;
  id: any
  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private UsersService: UsersService, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('admin_token');

    this.id = this.activatedRoute.snapshot.paramMap.get('token');
    console.log("-------token-------", this.id);

    this.verifyLink();
    this.changePasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmation: ['', [Validators.required]]
    }, { validators: passwordMatchValidator() });
  }


  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    let reqObj = {
      email: this.changePasswordForm.value.email,
      password: this.changePasswordForm.value.password,
      token: this.id
    };

    this.UsersService.changedPassword(this.id, reqObj).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.snackBar.open(data.message, 'OK', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['green-snackbar']
          });


          this.router.navigate(['/login']);


        } else if (data.status === 'error' || data.status === 'warning') {
          //  Handle both error and warning messages
          this.snackBar.open(data.message, 'OK', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['red-snackbar']
          });
        }
      },
      (error: any) => {
        this.isSubmited = false;
        this.snackBar.open(error?.error?.message || 'Something went wrong', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });
      }
    );
  }


  toggleFieldTextTypeone() {
    this.fieldTextTypeone = !this.fieldTextTypeone;
  }

  toggleFieldTextTypeone1() {
    this.fieldTextTypeone1 = !this.fieldTextTypeone1;
  }


  verifyLink() {
    console.log('=====verifylink==', this.id)
    let payload = {
      token : this.id
    }
    this.UsersService.verifyLink(payload).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.snackBar.open(data.message, 'OK', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['green-snackbar']
          });




        } else if (data.status === 'error' || data.status === 'warning') {
          //  Handle both error and warning messages
          console.log('-------------------',data.status)
          this.snackBar.open(data.message, 'OK', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['red-snackbar']
          });
          this.router.navigate(['/login']);
        }
      },
      (error: any) => {
        this.isSubmited = false;
        this.snackBar.open(error?.error?.message || 'Something went wrong', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });
          this.router.navigate(['/login']);
      }
    );
  }
}
