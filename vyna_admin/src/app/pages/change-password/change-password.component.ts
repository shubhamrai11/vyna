import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';


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
  formSubmitted: boolean = false;
  apiUrl: any;
  fieldTextTypeone2: boolean = false;
  fieldTextTypeone: boolean = false;
  fieldTextTypeone1: boolean = false;
  loading: any;
  isSubmited: boolean = false;
  id: any
  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private router: Router, private activatedRoute: ActivatedRoute, private UsersService: UsersService, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
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
    this.formSubmitted = true;
    this.commonService.setLoader(true);
    let reqObj = {
      old_password: this.changePasswordForm.value.email,
      password: this.changePasswordForm.value.password,
    };

    this.UsersService.changedAdminPassword(this.id, reqObj).subscribe(
      (data: any) => {
        if (data.status === true) {
          this.snackBar.open(data.message, 'OK', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['green-snackbar']
          });
          this.formSubmitted = false;
          this.commonService.setLoader(false);
          this.changePasswordForm.reset()
        } else if (data.status === 'error' || data.status === 'warning') {
          //  Handle both error and warning messages
          this.snackBar.open(data.message, 'OK', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['red-snackbar']
          });
          this.formSubmitted = false;
          this.commonService.setLoader(false);
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
  toggleFieldTextTypeone2() {
    this.fieldTextTypeone2 = !this.fieldTextTypeone2;
  }

  toggleFieldTextTypeone1() {
    this.fieldTextTypeone1 = !this.fieldTextTypeone1;
  }
}
