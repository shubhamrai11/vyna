import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/core/services/common.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-vision-add',
  templateUrl: './vision-add.component.html',
  styleUrls: ['./vision-add.component.css']
})
export class VisionAddComponent implements OnInit {
 config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no'
  };
  userId: any;
  addServiceCategory!: FormGroup;
  isEdit: boolean = false;
  selectedImage: any;
  selectedLogo: any;
    formSubmitted: boolean = false;

  selectedImagePreview: any;
  selectedLogoPreview: any;
  showImageError: boolean = false;
  showImageLogo: boolean = false;

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
    this.addServiceCategory = this.fb.group({
      title: ['', Validators.required],
      content: ['',Validators.required],
      image: [''],
      
    });

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.isEdit = true;
        this.getCategoryById();
      }
    });
  }

  getCategoryById() {
    this.usersService.getVisionById(this.userId).subscribe(
      (data: any) => {
        const result = data.data;
        this.addServiceCategory.patchValue({
          title: result.title,
          content: result.content
        });

        this.selectedImagePreview = result.icon;
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }
onImageChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImage = file;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.selectedImagePreview = e.target.result; //  Base64 image string
    };

    reader.readAsDataURL(file); //  Required line to trigger reader.onload
    this.showImageError = false;
  }
}


 addCategory(): void {
  // Step 1: Reset image error
  this.showImageError = false;

  // Step 2: Check for form validity AND image presence
  const isFormValid = this.addServiceCategory.valid;
  const isImageValid = !!this.selectedImage || this.isEdit; // Allow previewed image in edit mode

  if (isFormValid && isImageValid) {
     this.formSubmitted = true;
      this.commonService.setLoader(true);
    const formData = new FormData();
    formData.append('title', this.addServiceCategory.get('title')?.value);
    formData.append('content', this.addServiceCategory.get('content')?.value);

    if (this.selectedImage) {
      formData.append('icon', this.selectedImage);
    }

    const apiCall = this.userId
      ? this.usersService.editVision(this.userId, formData)
      : this.usersService.addVision(formData);

    apiCall.pipe(
      catchError((error) => {
        this.snackBar.open(error.error.message || 'Something went wrong', 'OK', {
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
          panelClass: ['green-snackbar']
        });
        this.router.navigate(['/pages/vision']);
      }
    });
  } else {
    // Step 3: Show errors
    if (!this.selectedImage && !this.isEdit) this.showImageError = true;

    this.addServiceCategory.markAllAsTouched();

    // Optional: scroll to top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

}
