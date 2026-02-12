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
  selector: 'app-subcategory-add',
  templateUrl: './subcategory-add.component.html',
  styleUrls: ['./subcategory-add.component.css']
})
export class SubcategoryAddComponent implements OnInit {
  categories: any
  userId: any;
  userAddForm!: FormGroup;
  showImageLogo1: any;
  isEdit: boolean = false;
  selectedImage: any;
  selectedImageMobile: any;
  selectedLogo: any;
  selectedImagePreview: any;
  selectedLogoPreview: any;
  selectedLogoPreviewMobile: any;

  showImageError: boolean = false;
  showImageLogo: boolean = false;
  formSubmitted: boolean = false;

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
    this.fetchCategories();
    this.userAddForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      subCategory_mobile_banner:[''],
      sequence: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$")]]
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
    this.usersService.getSUBCategoryById(this.userId).subscribe(
      (data: any) => {
        this.userAddForm.patchValue({
          question: data.data?.categoryId?._id,
          answer: data.data?.subCategoryName,
          sequence: data.data?.sequence
        });
        if (data.data?.image) {
          this.selectedImagePreview = data.data?.image
        }
        if (data.data?.subCategory_banner) {
          this.selectedLogoPreview = data.data?.subCategory_banner
        } if (data.data?.subCategory_mobile_banner) {
          this.selectedLogoPreviewMobile = data.data?.subCategory_mobile_banner
        }
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }

  fetchCategories(): void {
    this.usersService.getCatgeory(10, 0).subscribe(
      (response: any) => {

        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          this.categories = response.data.map((item: any) => ({
            value: item._id,
            label: item.category_name,
          }));

        } else {
          console.warn("Empty or Invalid Response:", response);
          this.categories = [];
        }
      },
      (error: any) => {
        console.error("Error fetching categories:", error);
      }
    );
  }

  onSubmit(): void {
    // ✅ Image validation
    if (!this.selectedLogo && !this.selectedImagePreview) {
      this.showImageError = true;
    } else {
      this.showImageError = false;
    }

    // ✅ Banner validation
    if (!this.selectedImage && !this.selectedLogoPreview) {
      this.showImageLogo = true;
    } else {
      this.showImageLogo = false;
    }
     if (!this.selectedImageMobile && !this.selectedLogoPreviewMobile) {
      this.showImageLogo1 = true;
    } else {
      this.showImageLogo1 = false;
    }

    // ✅ Agar form valid hai aur dono images ka validation pass ho gaya tabhi submit kare
    if (this.userAddForm.valid && !this.showImageError && !this.showImageLogo && ! this.showImageLogo1) {
      this.formSubmitted = true;
      this.commonService.setLoader(true);
      const formData = new FormData();

      formData.append('categoryId', this.userAddForm.get('question')?.value);
      formData.append('subCategoryName', this.userAddForm.get('answer')?.value);
      formData.append('sequence', this.userAddForm.get('sequence')?.value);

      if (this.selectedLogo) {
        formData.append('image', this.selectedLogo);
      }
      if (this.selectedImage) {
        formData.append('subCategory_banner', this.selectedImage);
      }
      if (this.selectedImageMobile) {
        formData.append('subCategory_mobile_banner', this.selectedImageMobile);
      }
      const apiCall = this.userId
        ? this.usersService.editSubCategory(this.userId, formData)
        : this.usersService.addSubCategeory(formData);

      apiCall.pipe(
        catchError((error) => {
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
          this.router.navigate(['/pages/subcategory']);
        }
      });
    } else {
      this.userAddForm.markAllAsTouched();
    }
  }



  onImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedLogo = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImagePreview = reader.result; // Base64 string
      console.log('==============avatar===========', this.selectedImagePreview);
      this.showImageError = false;
    };
    reader.readAsDataURL(file); // Convert to Base64
    this.showImageError = false;
  }

  onImageChange1(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedLogoPreview = reader.result; // Base64 string
      console.log('==============avatar===========', this.selectedLogoPreview);
      this.showImageLogo = false;
    };
    reader.readAsDataURL(file); // Convert to Base64
    this.showImageLogo = false;
  }
  onImageChange1Mobile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedImageMobile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedLogoPreviewMobile = reader.result; // Base64 string
      console.log('==============avatar===========', this.selectedLogoPreviewMobile);
      this.showImageLogo1 = false;
    };
    reader.readAsDataURL(file); // Convert to Base64
    this.showImageLogo1 = false;
  }
}
