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
  selector: 'app-contact-us-form-view',
  templateUrl: './contact-us-form-view.component.html',
  styleUrls: ['./contact-us-form-view.component.css']
})
export class ContactUsFormViewComponent implements OnInit {

  userId: any;
  userDetails: any;
  userAddForm!: FormGroup;

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
      _id: [''],
      title: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', Validators.required],
      website_url: ['', Validators.required],
      address: ['', Validators.required],
    });

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.getUserById();
      }
    });
  }

  getUserById() {
    this.usersService.getContactFormById(this.userId).subscribe(
      (data: any) => {
       // console.log('Fetched userDetails:', data);
        this.userDetails = data;
        this.userAddForm.patchValue({
          title:data.data?.name,
          address:data.data?.message,
          email:data.data?.email,
          mobile_number:data.data?.mobile_number
        });
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }


  onSubmit(): void {
  if (this.userAddForm.valid) {
    const contactId = this.userId;

    const payload = {
      title: this.userAddForm.value.title,
      email: this.userAddForm.value.email,
      mobile_number: this.userAddForm.value.mobile_number,
      address: this.userAddForm.value.address,
      website_url: this.userAddForm.value.website_url
    };

    this.usersService.editContactUs(contactId, payload).pipe(
      catchError((error) => {
        this.snackBar.open(error.error.message, 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });
        return throwError(() => error);
      })
    ).subscribe((data: any) => {
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
          panelClass: 'green-snackbar'
        });
        this.router.navigate(['/pages/contact-us-form']);
      }
    });
  } else {
    this.userAddForm.markAllAsTouched();
  }
}
}