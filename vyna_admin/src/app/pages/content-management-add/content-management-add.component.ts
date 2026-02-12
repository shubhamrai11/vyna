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
  selector: 'app-content-management-add',
  templateUrl: './content-management-add.component.html',
  styleUrls: ['./content-management-add.component.css']
})
export class ContentManagementAddComponent implements OnInit {
  isSubmitting = false;

  userId: any;
  addServiceCategory!: FormGroup;
  isEdit: boolean = false;
  selectedImage: any;
  selectedLogo: any;
  selectedImagePreview: any;
  selectedLogoPreview: any;
  showImageError: boolean = false;
  showImageLogo: boolean = false;
config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no'
  };
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
      image: [''],
      content: ['',Validators.required],
     
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
    this.usersService.getContentById(this.userId).subscribe(
      (data: any) => {
        const result = data.data;
        this.addServiceCategory.patchValue({
          title: result.title,
          content: result.content
        });

       
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file;
    this.selectedImagePreview = URL.createObjectURL(file);
    this.showImageError = false;
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    this.selectedLogo = file;
    this.selectedLogoPreview = URL.createObjectURL(file);
    this.showImageLogo = false;
  }

  addCategory(): void {
    if (this.addServiceCategory.valid) {
      const formData = new FormData();
       this.isSubmitting = true;
        this.commonService.setLoader(true);
      formData.append('title', this.addServiceCategory.get('title')?.value);
      formData.append('content', this.addServiceCategory.get('content')?.value);

      const apiCall = this.userId
        ? this.usersService.editContent(this.userId, formData)
        : this.usersService.addCategeory(formData);

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
          this.router.navigate(['/pages/content']);
        }
      });
    } else {
      if (!this.selectedImage) this.showImageError = true;
      if (!this.selectedLogo) this.showImageLogo = true;
      this.addServiceCategory.markAllAsTouched();
    }
  }
}
