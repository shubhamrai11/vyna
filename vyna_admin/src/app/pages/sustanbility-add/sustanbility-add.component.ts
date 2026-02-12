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
  selector: 'app-sustanbility-add',
  templateUrl: './sustanbility-add.component.html',
  styleUrls: ['./sustanbility-add.component.css']
})
export class SustanbilityAddComponent implements OnInit {

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
  selectedImagePreview: any;
  selectedLogoPreview: any;
  showImageError: boolean = false;
  showImageLogo: boolean = false;
  formSubmitted: boolean = false;

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
      title: ['', Validators.required],
      image: [''],
      category_logo: [''],
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
    this.usersService.getaboutusSustainbilityById(this.userId).subscribe(
      (data: any) => {
        const result = data.data;
        this.addServiceCategory.patchValue({
          title: result.title,
          description: result.description
        });

        this.selectedImagePreview = result.image;
     //   this.selectedLogoPreview = result.category_logo;
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

  onLogoChange(event: any) {
    const file = event.target.files[0];
    this.selectedLogo = file;
    const blobUrl = URL.createObjectURL(file);
    this.selectedLogoPreview = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    this.showImageLogo = false;
    this.cd.detectChanges(); // Ensure preview updates
  }

  addCategory(): void {
    if (this.addServiceCategory.valid) {
      const formData = new FormData();
       this.formSubmitted = true;
      this.commonService.setLoader(true);
      formData.append('title', this.addServiceCategory.get('title')?.value);
      formData.append('description', this.addServiceCategory.get('description')?.value);

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
     

      const apiCall = this.userId
        ? this.usersService.editaboutusSustainbility(this.userId, formData)
        : this.usersService.addCategeory(formData);

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
          this.router.navigate(['/pages/sustanbility']);
        }
      });
    } else {
      if (!this.selectedImage) this.showImageError = true;
      if (!this.selectedLogo) this.showImageLogo = true;
      this.addServiceCategory.markAllAsTouched();
    }
  }
}
