import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { CommonService } from 'src/app/core/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import namer from 'color-namer';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

 config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no'
  };
  addAdditionalService!: FormGroup;
  isEdit = false;
  isSubmitting = false;
  productId: any;
  pageSize = 100;
  totalPages: number[] = []; // Holds the number of pages

  pageIndex = 0;
  pages: number[] = [];
  categoryList: any[] = [];
  subCategoryList: any[] = [];

  selectedImages: string[] = [];
  uploadedFiles: File[] = [];
  imagesPreview: any[] = [];
product:any;
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getCategories();
    this.getSubCategories()
    this.productId = this.activatedRoute.snapshot.params['id'];
    if (this.productId) {
      this.isEdit = true;
      this.getProductDetails(this.productId);
    }
  }

  initializeForm() {
    this.addAdditionalService = this.fb.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      specification: this.fb.array([this.createSpecificationGroup()]),
      colorTemperature: this.fb.array([this.createColorTempature()]),
      color: this.fb.array([this.craeteColor()]),
      keyFeatures: ['']

    });
  }
  createColorTempature(): FormGroup {
    return this.fb.group({
      watt: [''],
      image: [''],
      imageFile: ['']

    });
  }
  craeteColor(): FormGroup {
    return this.fb.group({
      name: [''],

    });
  }
  createSpecificationGroup(): FormGroup {
    return this.fb.group({
      ratedWattage: [''],
      lumen: [''],
      shape: [''],
      cutOutSizeInmm: [''],
      powerFactor: [''],
      colourTemperature: [''],
      housing: [''],
      beamAngle: [''],
      swivelArrangement: [''],
      price: [''],
      availableQuantity: [''],
      //  Newly Added Keys
      lengthInMm: [''],
      widthInMm: [''],
      protectionClass: [''],
      cri: [''],
      stdPkg: [''],
      base:[''],
      lumenAC:[''],
      lumenDC:['']


    });
  }

  get specifications(): FormArray {
    return this.addAdditionalService.get('specification') as FormArray;
  }
  get colorTemperature(): FormArray {
    return this.addAdditionalService.get('colorTemperature') as FormArray;
  }

  get color(): FormArray {
    return this.addAdditionalService.get('color') as FormArray;
  }


  addColor(): void {
    this.color.push(this.craeteColor());
  }

  addColorTempature(): void {
    this.colorTemperature.push(this.createColorTempature());
  }

  addSpecification(): void {
    this.specifications.push(this.createSpecificationGroup());

  }

  removeSpecification(index: number): void {
    if (this.specifications.length > 1) {
      this.specifications.removeAt(index);
    }
  }

  onImageSelected(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(img: any): void {
    //   console.log('=====img======', img)
    this.imagesPreview = this.imagesPreview.filter(i => i !== img);
    this.deleteItem(img._id)
  }

  deleteItem(assetId: any): void {
    //console.log('=======assetId======', assetId)
    // if (confirm('Are You Sure You Want To Delete This Asset Management?')) {
    this.usersService.deleteProductImage(this.productId, assetId)
      .pipe(
        catchError((error) => {
          throw error;
        })
      )
      .subscribe((data: any) => {
        this.getProductDetails(this.productId);


      });
    // }
  }

  getCategories(): void {
    this.usersService.getCatgeory().subscribe((res: any) => {
      this.categoryList = res.data;
    });
  }
  getSubCategories(): void {
    this.usersService.Subcategory(this.pageIndex + 1, this.pageSize).subscribe((res: any) => {
      this.subCategoryList = res.data;
    });
  }

  getProductDetails(id: string): void {
    // this.commonService.setLoader(true);
    this.usersService.getProductById(id).subscribe((res: any) => {
      const data = res.data;
      this.product = data;
      console.log('==============this.product---',this.product)
      this.addAdditionalService.patchValue({
        productName: data.productName,
        keyFeatures: data?.keyFeatures,
        description: data.description,
        categoryId: data.categoryId?._id,
        subCategoryId: data.subCategoryId?._id
      });
      if (Array.isArray(data.color)) {
        this.color.clear();
        data.color.forEach((color: any) => {
        
          this.color.push(this.fb.group({
            name: [color.name],
          }));
        });
      }
      if (Array.isArray(data.colorTemperature)) {
        this.colorTemperature.clear();
        data.colorTemperature.forEach((ct: any) => {
          this.colorTemperature.push(this.fb.group({
            watt: [ct.watt],
            imageFile: [null], // ImageFile stays null unless user changes it
            image: [ct.image] // For displaying preview
          }));
        });
      }


      if (Array.isArray(data.specification)) {
        this.specifications.clear();
        data.specification.forEach((spec: any) => {
          this.specifications.push(this.fb.group(spec));
        });
      }
      if (data.image) {
        this.imagesPreview = data.image;
      }
    });
  }
  addAdditionalServices(): void {
    if (this.isSubmitting || this.addAdditionalService.invalid) {
      this.addAdditionalService.markAllAsTouched();
      return;
    }
    this.submitForm('add');
  }

  updateAdditionalService(): void {
    if (this.isSubmitting || this.addAdditionalService.invalid) {
      this.addAdditionalService.markAllAsTouched();
      return;
    }

    this.submitForm('update');
  }
  submitForm(action: 'add' | 'update'): void {
    this.isSubmitting = true;
    //  this.commonService.setLoader(true);

    const val = this.addAdditionalService.value;

    const formData = new FormData();
    formData.append('productName', val.productName);
    formData.append('description', val.description);
    formData.append('categoryId', val.categoryId);
    formData.append('subCategoryId', val.subCategoryId);
    formData.append('specification', JSON.stringify(val.specification));
    formData.append('keyFeatures', val.keyFeatures);
    formData.append('color', JSON.stringify(val.color));
    const colorTemperatureArray: any[] = [];

    this.colorTemperature.controls.forEach((ct, index) => {
      if (ct.value.imageFile) {
        formData.append('colorTemperatureImages', ct.value.imageFile); // images can be appended multiple times

        colorTemperatureArray.push({
          watt: ct.value.watt,
        });
      } else {
        colorTemperatureArray.push({
          watt: ct.value.watt,
        });
      }
    });

    formData.append('colorTemperature', JSON.stringify(colorTemperatureArray));


    this.uploadedFiles.forEach(file => formData.append('image', file));

    const request = action === 'update'
      ? this.usersService.editProduct(this.productId, formData)
      : this.usersService.addProduct(formData);

    request.pipe(
      catchError((err) => {
        this.snackBar.open(err.error?.message || 'Submission failed', 'OK', { duration: 3000 });
        this.isSubmitting = false;
        //  this.commonService.setLoader(false);
        return throwError(() => err);
      })
    ).subscribe(res => {
      this.snackBar.open(res.message, 'OK', { duration: 3000 });
      this.router.navigate(['/pages/product']);
      this.isSubmitting = false;
      this.commonService.setLoader(false);
    });
  }

  resetForm(): void {
    this.addAdditionalService.reset();
    this.uploadedFiles = [];
    this.selectedImages = [];
    this.imagesPreview = [];
    this.specifications.clear();
    this.color.clear();
    this.colorTemperature.clear();
    this.specifications.push(this.createSpecificationGroup());
    this.color.push(this.craeteColor);
    this.colorTemperature.push(this.createColorTempature)
  }
  onIconUpload(event: any, index: number): void {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith('image/')) {
      this.snackBar.open('Please upload a valid image file.', 'OK', { duration: 3000 });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = reader.result as string;

      // Store both preview URL and file (binary)
      this.colorTemperature.at(index).patchValue({
        image: previewUrl,     // For preview in the UI
        imageFile: file        // For sending binary to backend
      });
    };
    reader.readAsDataURL(file);
  }
getColorName(code: string): string {
  try {
   // console.log('====code=============',code)
    const result = namer(code);
    return result.ntc[0].name;
  } catch {
    return code;
  }
}
}
