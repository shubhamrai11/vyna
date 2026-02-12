import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/core/services/common.service';
import { catchError } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { throwError } from 'rxjs';
@Component({
  selector: 'app-cms-banner-add',
  templateUrl: './cms-banner-add.component.html',
  styleUrls: ['./cms-banner-add.component.css']
})
export class CmsBannerAddComponent implements OnInit {
  userId: any;
  userAddForm!: FormGroup;
  isEdit: boolean = false;
  formSubmitted: boolean = false;

  selectedFile: any;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private router: Router
  ) { }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no'
  };
  ngOnInit(): void {
    this.userAddForm = this.fb.group({
      image: [''],
      // title: ['', Validators.required],
      // content: ['', Validators.required],

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
    this.usersService.getCMSBannerById(this.userId).subscribe(
      (data: any) => {
        this.userAddForm.patchValue({ image: data.data.image, content: data.data?.content, title: data.data?.title });
        this.imagePreview = data.data.image; // Set preview
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  imageErrors: string[] = [];

  onFileChange(event: any) {
    const files = event.target.files;
    this.selectedFiles = [];
    this.imagePreviews = [];
    this.imageErrors = [];

    if (files && files.length > 0) {
      let processedCount = 0;

      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {

            this.selectedFiles.push(file);
            this.imagePreviews.push(reader.result as string);



            processedCount++;
            // ✅ Only update the form once all files processed
            if (processedCount === files.length) {
              if (this.selectedFiles.length > 0) {
                this.userAddForm.get('image')?.setValue(this.selectedFiles);
                this.userAddForm.get('image')?.setErrors(null);
              } else {
                this.userAddForm.get('image')?.setValue(null);
                this.userAddForm.get('image')?.setErrors({ required: true });
              }
            }
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;



    if (this.userAddForm.invalid || !this.isEdit && this.selectedFiles.length === 0) {
      this.userAddForm.markAllAsTouched();   // key line

      return;
    }
    this.commonService.setLoader(true);

    const formData = new FormData();
    this.selectedFiles.forEach((file) => {
      formData.append('image', file);
    });
    // formData.append('title', this.userAddForm.value.title);
    // formData.append('content', this.userAddForm.value.content);

    const apiCall = this.userId
      ? this.usersService.editCMSBanner(this.userId, formData)
      : this.usersService.addCMSBanner(formData);

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
      this.snackBar.open(data.message, 'OK', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['green-snackbar']
      });
      this.router.navigate(['/pages/cms-banner']);
    });
  }


}

