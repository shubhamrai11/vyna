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
  selector: 'app-subcategory-view',
  templateUrl: './subcategory-view.component.html',
  styleUrls: ['./subcategory-view.component.css']
})
export class SubcategoryViewComponent implements OnInit {
  categories: any
  userId: any;
  userAddForm!: FormGroup;
  isEdit: boolean = false;
  subCategory:any;
  selectedImage: any;
  selectedLogo: any;
  category:any;
  productsList:any;
  selectedImagePreview: any;
  selectedCategoryName:any;
  data:any;
  currentSubCategoryId:any;
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
   // this.fetchCategories();
    this.userAddForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.isEdit = true;
        this. getById()
        this.getUserById();
      }
    });
  }
 getById() {
    this.usersService.getSUBCategoryById(this.userId).subscribe(
      (data: any) => {
      
         this.category = data.data?.categoryId;
        this.subCategory =  data?.data;
      //   console.log('data-----------',  this.subCategory)
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }
 getUserById() {
  this.usersService.getSUBCategoryProductById(this.userId).subscribe(
    (res: any) => {
      this.productsList = res.data || [];

      // Optional: Pick category & sub-category from the first product
      if (this.productsList.length > 0) {
        // this.category = this.productsList[0].categoryId?.category_name;
        // this.subCategory = this.productsList[0].subCategoryId?.subCategoryName;
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
    if (this.userAddForm.valid) {
      const formData = new FormData();
      formData.append('categoryId', this.userAddForm.get('question')?.value);
      formData.append('subCategoryName', this.userAddForm.get('answer')?.value);
      if (this.selectedLogo) {
        formData.append('image', this.selectedLogo);
      }


      const apiCall = this.userId
        ? this.usersService.editSubCategory(this.userId, formData)
        : this.usersService.addSubCategeory(formData); //  Add condition added here

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
     // console.log('==============avatar===========', this.selectedImagePreview);
      this.showImageLogo = false;
    };
    reader.readAsDataURL(file); // Convert to Base64
    this.showImageError = false;
  }

  goToProduct(productId: string) {
  if (productId) {
    this.router.navigate(['/pages/product-view', productId]);
  }
}
}
