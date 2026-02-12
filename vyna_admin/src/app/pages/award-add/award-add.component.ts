import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/core/services/common.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-award-add',
  templateUrl: './award-add.component.html',
  styleUrls: ['./award-add.component.css']
})
export class AwardAddComponent implements OnInit {
  @ViewChild('formElement') formElement!: ElementRef;

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
  isEdit = false;
  formSubmitted: boolean = false;

  // Image controls
  selectedAwardImage: File | null = null;
  selectedAwardPreview: string | null = null;

  selectedSideImages: File[] = [];
  sideImagePreviews: string[] = [];

  selectedGeneralImage: File | null = null;
  selectedGeneralPreview: string | null = null;

  // Error flags
  showAwardImageError = false;
  showSideImageError = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.addServiceCategory = this.fb.group({
      heading: ['', Validators.required],
      description: ['', Validators.required],
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
    this.usersService.getAwardsById(this.userId).subscribe(
      (data: any) => {
        const result = data.data;
        this.addServiceCategory.patchValue({
          heading: result.heading,
          description: result.description
        });

        this.selectedAwardPreview = result.award_image;
        this.sideImagePreviews = result.side_image.map((img: any) => img.url);
        this.selectedGeneralPreview = result.image.length > 0 ? result.image[0].url : null;

      },
      (error: any) => {
        console.error('Fetch error => ', error);
      }
    );
  }

  deImageChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedSideImages = [];
    this.sideImagePreviews = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedSideImages.push(file);
      this.sideImagePreviews.push(URL.createObjectURL(file));
    }
    this.showSideImageError = false;
  }

  addCategory(): void {
    if (this.addServiceCategory.invalid) {
      this.addServiceCategory.markAllAsTouched();
      setTimeout(() => {
        this.scrollToFirstInvalidControl()
      }, 100);
      return;
    }
  this.formSubmitted = true;
    this.commonService.setLoader(true);
    const formData = new FormData();
    formData.append('heading', this.addServiceCategory.get('heading')?.value);
    formData.append('description', this.addServiceCategory.get('description')?.value);

    if (this.selectedAwardImage) {
      formData.append('award_image', this.selectedAwardImage);
    }

    if (this.selectedSideImages.length > 0) {
      this.selectedSideImages.forEach((file, index) => {
        formData.append('side_image', file); // Adjust if backend expects array
      });
    }

    if (this.selectedGeneralImage) {
      formData.append('image', this.selectedGeneralImage);
    }

    const apiCall = this.userId
      ? this.usersService.editAward(this.userId, formData)
      : this.usersService.addAward(formData);

    apiCall.pipe(
      catchError((error) => {
          this.formSubmitted = false;
    this.commonService.setLoader(false);
        this.snackBar.open(error.error.message || 'Something went wrong', 'OK', {
          duration: 2000,
          panelClass: ['red-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        return throwError(() => error);
      })
    ).subscribe((res: any) => {
      const message = res.message || 'Success';
      const panelClass = res.status === 'error' ? 'red-snackbar' : 'green-snackbar';
   this.formSubmitted = false;
    this.commonService.setLoader(false);
      this.snackBar.open(message, 'OK', {
        duration: 3000,
        panelClass: [panelClass],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });

      if (res.status !== 'error') {
        this.router.navigate(['/pages/award']);
      }
    });
  }

  onAwardImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedAwardImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedAwardPreview = reader.result as string; // base64 string
      };
      reader.readAsDataURL(file);

      this.showAwardImageError = false;
    }
  }
  onSideImageChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedSideImages = [];
    this.sideImagePreviews = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedSideImages.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.sideImagePreviews.push(reader.result as string); // base64 push
      };
      reader.readAsDataURL(file);
    }

    this.showSideImageError = false;
  }
  onGeneralImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedGeneralImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedGeneralPreview = reader.result as string; // base64 string
      };
      reader.readAsDataURL(file);
    }
  }




  scrollToFirstInvalidControl(): void {
    const getInvalidFields = (form: FormGroup | FormArray): string[] => {
      const invalidFields: string[] = [];
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control instanceof FormGroup || control instanceof FormArray) {
          invalidFields.push(...getInvalidFields(control));
        } else if (control && control.invalid) {
          invalidFields.push(key);
        }
      });

      return invalidFields;
    };

    const invalidFields = getInvalidFields(this.addServiceCategory);

    if (invalidFields.length > 0 && this.formElement) {
      const firstInvalidControl = this.formElement.nativeElement.querySelector(
        `[formControlName="${invalidFields[0]}"]`
      );

      if (firstInvalidControl) {
        (firstInvalidControl as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        (firstInvalidControl as HTMLElement).focus();
      }
    }
  }
}
