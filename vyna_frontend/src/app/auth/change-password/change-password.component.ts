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
  loading: any;
  isSubmited: boolean = false;
  id: any
  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private UsersService: UsersService, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('admin_token');

    this.id = this.activatedRoute.snapshot.queryParamMap.get('id');
    // console.log("--------------", this.id)
    this.changePasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmation: ['', [Validators.required]]
    }, { validators: passwordMatchValidator() });
  }


  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    } else {
      // console.log('changePasswordForm');
      let reqObj = {
        email: this.changePasswordForm.value.email,
        password: this.changePasswordForm.value.password,
        confirmation: this.changePasswordForm.value.confirmation
      }
      //   console.log('reqObj-------', reqObj)
      this.UsersService.changedPassword(this.id, reqObj).subscribe(
        (data: any) => {
          if (data.status == 'success') {
            //console.log('========error======', data);
            this.snackBar.open(data.message, 'ok', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['green-snackbar']
            });

            if (this.token) {
              console.log('======token============')
              this.router.navigate(['/pages/administrator']);
            } else {
              this.router.navigate(['/login']);
              console.log('======token=======not======== come=====')

            }


          } if (data.status == 'error') {
            this.snackBar.open(data.message, 'ok', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['red-snackbar']
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
      //  console.log('==============================================')
    }
  }
}
