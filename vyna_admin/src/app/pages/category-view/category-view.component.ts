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
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {
  userId: any;
  addServiceCategory!: FormGroup;
  subCategories: any[] = [];
  isEdit: boolean = false;
  selectedImage: any;
  selectedLogo: any;
  selectedImagePreview: any;
  selectedLogoPreview: any;
  showImageError: boolean = false;
  showImageLogo: boolean = false;
  category: any;
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
      category_name: ['', Validators.required],
      category_image: [''],
      category_logo: [''],
      category_description: ['', Validators.required],
    });

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.isEdit = true;
        this.getCategoryById();
        this.getSUBCategoryById()
      }
    });
  }

  getCategoryById() {
    this.usersService.getCatgeoryById(this.userId).subscribe(
      (data: any) => {
        const result = data.data;
       this.category =result
      // console.log('===========this.category------',this.category)
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }

  getSUBCategoryById() {
    this.usersService.getSubcategoryByCateytgeoryId(this.userId).subscribe(
      (data: any) => {
        const result = data.data;
       // console.log('===============result-----', result)
        if (result?.length > 0) {
      //    console.log('============categorycategory-------',this.category)
          this.subCategories = result.map((item: { subCategoryName: any; createdAt: any; _id:any }) => ({
            subCategoryName: item.subCategoryName,
            createdAt: item.createdAt,
            _id:item._id
          }));
           console.log('============subCategories-------',this.subCategories)
        }
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
      formData.append('category_name', this.addServiceCategory.get('category_name')?.value);
      formData.append('category_description', this.addServiceCategory.get('category_description')?.value);

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
          this.router.navigate(['/pages/category']);
        }
      });
    } else {
      if (!this.selectedImage) this.showImageError = true;
      if (!this.selectedLogo) this.showImageLogo = true;
      this.addServiceCategory.markAllAsTouched();
    }
  }

  goToCategory(categoryId: string) {
  if (categoryId) {
    this.router.navigate(['/pages/subcategory-view', categoryId]);
  }
}
}
