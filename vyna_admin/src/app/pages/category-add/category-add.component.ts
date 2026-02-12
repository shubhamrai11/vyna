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
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no'
  };
  userId: any;
  showBannerError1:any;
  addServiceCategory!: FormGroup;
  isEdit: boolean = false;
  formSubmitted: boolean = false;
selectedBanner1:any
  selectedImage: any;
  selectedBanner: any;
  selectedImage1: any;
  selectedBannerPreview1:any;

  selectedLogo: any;
  selectedImagePreview: any;
  selectedBannerPreview: any;
  selectedImage1Preview: any;

  selectedLogoPreview: any;
  showImageError: boolean = false;
  showImage1Error: boolean = false;
  showBannerError: boolean = false;
  showImageLogo: boolean = false;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.addServiceCategory = this.fb.group({
      category_name: ['', Validators.required],
      category_image: [''],
      category_banner: [''],
      category_image1: [''],
      category_logo: [''],
      category_description: ['', Validators.required],
            category_mobile_banner: ['',],

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
    this.usersService.getCatgeoryById(this.userId).subscribe(
      (data: any) => {
        const result = data.data;
        this.addServiceCategory.patchValue({
          category_name: result.category_name,
          category_description: result.category_description
        });

        this.selectedImagePreview = result.category_image;
          this.selectedBannerPreview = result.category_banner;
        this.selectedImage1Preview = result?.image;
        this.selectedLogoPreview = result.category_logo;
        this.selectedBannerPreview1= result?.category_mobile_banner;
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file;
    const blobUrl = URL.createObjectURL(file);
    this.selectedImagePreview = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    this.showImageError = false;
    this.cd.detectChanges(); // Ensure preview updates
  }

  onbannerChange(event: any) {
    const file = event.target.files[0];
    this.selectedBanner = file;
    const blobUrl = URL.createObjectURL(file);
    this.selectedBannerPreview = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    this.showBannerError = false;
    this.cd.detectChanges(); // Ensure preview updates
  }
   onbanner1Change(event: any) {
    const file = event.target.files[0];
    this.selectedBanner1 = file;
    const blobUrl = URL.createObjectURL(file);
    this.selectedBannerPreview1 = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    this.showBannerError1 = false;
    this.cd.detectChanges(); // Ensure preview updates
  }
  onImage1Change(event: any) {
    const file = event.target.files[0];
    this.selectedImage1 = file;
    const blobUrl = URL.createObjectURL(file);
    this.selectedImage1Preview = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    this.showImage1Error = false;
    this.cd.detectChanges(); // Ensure preview updates
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    this.selectedLogo = file;
    const blobUrl = URL.createObjectURL(file);
    this.selectedLogoPreview = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    this.showImageLogo = false;
    this.cd.detectChanges(); // Ensure preview updates
  }

  addCategory(): void {
    this.formSubmitted = true;

    // Mark form controls as touched
    this.addServiceCategory.markAllAsTouched();

    // Check required images ONLY in Add mode
    if (!this.isEdit) {
      if (!this.selectedImage) this.showImageError = true;
      if (!this.selectedImage1) this.showImage1Error = true;
      if (!this.selectedLogo) this.showImageLogo = true;
      if (!this.selectedBanner) this.showBannerError = true;
      if (!this.selectedBanner1) this.showBannerError1 = true;
      //  console.log('============value come here=========')
      // Stop submission if missing required images
      if (!this.selectedImage || !this.selectedLogo || !this.selectedImage1 || !this.selectedBanner || !this.selectedBanner1) {
        return;
      }

    }

    const formData = new FormData();
    this.commonService.setLoader(true);

    formData.append('category_name', this.addServiceCategory.get('category_name')?.value);
    formData.append('category_description', this.addServiceCategory.get('category_description')?.value);
    if (this.selectedImage1) {
      formData.append('image', this.selectedImage1);
    }
    if (this.selectedBanner) {
      formData.append('category_banner', this.selectedBanner);
    }
     if (this.selectedBanner1) {
      formData.append('category_mobile_banner', this.selectedBanner1);
    }
    if (this.selectedImage) {
      formData.append('category_image', this.selectedImage);
    }
    if (this.selectedLogo) {
      formData.append('category_logo', this.selectedLogo);
    }

    const apiCall = this.userId
      ? this.usersService.editCategory(this.userId, formData)
      : this.usersService.addCategeory(formData);

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
      this.commonService.setLoader(false);
      this.formSubmitted = false;

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
        this.router.navigate(['/pages/category']);
      }
    });
  }


}
