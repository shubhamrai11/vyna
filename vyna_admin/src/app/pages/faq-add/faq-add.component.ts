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
  selector: 'app-faq-add',
  templateUrl: './faq-add.component.html',
  styleUrls: ['./faq-add.component.css']
})
export class FAQADDComponent implements OnInit {
  isSubmitting = false;
  userId: any;
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
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.isEdit = true;

        this.getUserById();
      }
    });
  }

  getUserById() {
    this.usersService.getFaqById(this.userId).subscribe(
      (data: any) => {
        this.userAddForm.patchValue(data.data);
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }

  onSubmit(): void {
    if (this.userAddForm.valid) {
      const payload = {
        question: this.userAddForm.value.question,
        answer: this.userAddForm.value.answer,
      };
      this.isSubmitting = true;
      this.commonService.setLoader(true);
      const apiCall = this.userId
        ? this.usersService.editFaq(this.userId, payload)
        : this.usersService.addFaq(payload); // 👈 Add condition added here

      apiCall.pipe(
        catchError((error) => {
          this.isSubmitting = false;
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
        this.isSubmitting = false;
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
          this.router.navigate(['/pages/faq']);
        }
      });
    } else {
      this.userAddForm.markAllAsTouched();
    }
  }
}
