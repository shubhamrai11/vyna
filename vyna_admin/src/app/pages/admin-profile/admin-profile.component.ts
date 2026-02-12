import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/core/services/common.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  selectedLogo: any;
  selectedImagePreview: any;
  selectedLogoPreview: any;
    formSubmitted : boolean = false;

  userId: any;
  showImageLogo: boolean = false;
  userAddForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userAddForm = this.fb.group({
      email: ['', Validators.required],
      mobile_number: ['', Validators.required],
      name: ['', Validators.required],
      image: ['']
    });
    this.getUser();

  }

  getUser() {
    this.usersService.getAdmin().subscribe(
      (data: any) => {
        this.userAddForm.patchValue({
          name: data?.data.first_name,
          email: data?.data.email,
          mobile_number: data?.data.mobileNumber
        });
        if (data?.data.avatar) {
       
          this.selectedLogoPreview = data?.data?.avatar;


        }
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }

  onSubmit(): void {
    if (this.userAddForm.valid) {
      const formData = new FormData();
    this.formSubmitted = true;
        this.commonService.setLoader(true);
      formData.append('first_name', this.userAddForm.get('name')?.value);
   //   formData.append('email', this.userAddForm.get('email')?.value);
      formData.append('mobileNumber', this.userAddForm.get('mobile_number')?.value)
      if (this.selectedLogo) {
        formData.append('avatar', this.selectedLogo);
      }
 

      const apiCall = this.userId
        ? this.usersService.editFaq(this.userId, formData)
        : this.usersService.AdminProfileUpdate(formData); //  Add condition added here

      apiCall.pipe(
        catchError((error) => {
           this.formSubmitted = false;
        this.commonService.setLoader(false);
          this.snackBar.open(error.error.message || 'Something went wrong', 'OK', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['red-snackbar']
          });
          return throwError(() => error);
        })
      ).subscribe((data: any) => {
this.formSubmitted = false;
        this.commonService.setLoader(false);
        if (data.status === 'error') {
          this.snackBar.open(data.message, 'OK', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['red-snackbar']
          });
        } else {
          this.snackBar.open(data.message, 'OK', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['green-snackbar']
          });
          this.router.navigate(['/pages/dashboard']);
        }
      });
    } else {
      this.userAddForm.markAllAsTouched();
    }
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedLogo = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedLogoPreview = reader.result; // Base64 string
      console.log('==============avatar===========', this.selectedLogoPreview);
      this.showImageLogo = false;
    };
    reader.readAsDataURL(file); // Convert to Base64
  }


}

