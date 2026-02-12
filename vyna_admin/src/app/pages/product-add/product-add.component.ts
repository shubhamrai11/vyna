import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { CommonService } from 'src/app/core/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  @ViewChild('formElement') formElement!: ElementRef;
  selectedCategory: string | null = null;
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
  categoryName: any;
  categoryList: any[] = [];
  subCategoryList: any[] = [];

  selectedImages: string[] = [];
  uploadedFiles: File[] = [];
  imagesPreview: any[] = [];
  pageSize = 100;
  totalPages: number[] = []; // Holds the number of pages
  imagesPreview1: any[] = [];
  uploadedFiles1: any[] = []
  selectedImages1: any[] = []
  pageIndex = 0;
  pages: number[] = [];
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getCategories();

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
      short_description: [''],
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      specification: this.fb.array([this.createSpecificationGroup()]),
      colorTemperature: this.fb.array([this.createColorTempature()]),
      color: this.fb.array([this.craeteColor()]),
      //  keyFeatures: ['', Validators.required]

    });
  }
  createColorTempature(): FormGroup {
    return this.fb.group({
      watt: ['',],
      image: ['',],
      imageFile: ['']

    });
  }
  craeteColor(): FormGroup {
    return this.fb.group({
      name: ['',],

    });
  }
  createSpecificationGroup(): FormGroup {
    return this.fb.group({
      ratedWattage: ['',],
      lumen: [''],
      shape: ['',],
      cutOutSizeInmm: [''],
      powerFactor: [''],
      colourTemperature: ['',],
      housing: [''],
      beamAngle: ['',],
      swivelArrangement: [''],
      price: [''],
      availableQuantity: [''],
      //  Newly Added Keys
      lengthInMm: ['',],
      widthInMm: ['',],
      protectionClass: [''],
      cri: [''],
      stdPkg: ['',],
      base: ['',],
      lumenAC: [''],
      lumenDC: [''],
      breaking_capacity: [''],
      MCB_type: [''],
      curve: [''],
      pole: [''],
      ampere: [''],
      sensitivity: [''],
      door_type: [''],
      DB_type: [''],
      phase: [''],
      number_of_way: [''],
      module: [''],
      type: [''],
      // 📌 New fields from your image
      standardConformity: [''],
      noOfPole: [''],
      magneticReleaseSetting: [''],
      methodOfMounting: [''],
      ratedOperationalVoltage: [''],
      ratedCurrent: [''],
      ratedFrequency: [''],
      ratedShortCircuitCapacity: [''],
      maxValueOfI2t: [''],
      ratedInsulationVoltage: [''],
      ratedImpulseWithstandsVoltage: [''],
      materialGroup: [''],
      ipCategory: [''],
      ambientTemp: [''],
      tighteningTorque: [''],
      dielectricTestVoltage: [''],
      energyLimitingClass: [''],
      vibration: [''],
      installationPosition: [''],
      biConnectTerminal: [''],
      lineAndLoadTerminalCapacity: [''],
      resistanceToShock: [''],
      enduranceMechanicalElectricalCycles: [''],
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
  onImageSelected1(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadedFiles1.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages1.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }




  removeImage(img: any): void {
    this.imagesPreview = this.imagesPreview.filter(i => i !== img);

    this.deleteItem(img._id);
  }

  removeImage1(img: any): void {
    this.imagesPreview1 = this.imagesPreview1.filter(i => i !== img);

    this.deleteItem1(img._id);
  }



  deleteItem1(assetId: any): void {
    this.usersService.deleteProductImage1(this.productId, assetId)
      .pipe(
        catchError((error) => {
          console.error('Delete failed', error);
          throw error;
        })
      )
      .subscribe(() => {
        // Sirf local array update karna hai, form ko reload mat karo
        console.log('Image deleted successfully');
      });
  }
  deleteItem(assetId: any): void {
    this.usersService.deleteProductImage(this.productId, assetId)
      .pipe(
        catchError((error) => {
          console.error('Delete failed', error);
          throw error;
        })
      )
      .subscribe(() => {
        // Sirf local array update karna hai, form ko reload mat karo
        console.log('Image deleted successfully');
      });
  }

  // removeImage(img: any): void {
  //   //   console.log('=====img======', img)
  //   this.imagesPreview = this.imagesPreview.filter(i => i !== img);
  //   this.deleteItem(img._id)
  // }

  // deleteItem(assetId: any): void {
  //   //console.log('=======assetId======', assetId)
  //   // if (confirm('Are You Sure You Want To Delete This Asset Management?')) {
  //   this.usersService.deleteProductImage(this.productId, assetId)
  //     .pipe(
  //       catchError((error) => {
  //         throw error;
  //       })
  //     )
  //     .subscribe((data: any) => {
  //       //this.getProductDetails(this.productId);
  //     });
  //   // }
  // }

  getCategories(): void {
    this.usersService.getCatgeory().subscribe((res: any) => {
      this.categoryList = res.data;



    });
  }
  // getSubCategories(): void {
  //   this.usersService.Subcategory(this.pageIndex + 1, this.pageSize).subscribe((res: any) => {
  //     this.subCategoryList = res.data;
  //  //   console.log('subCategoryList---------',this.subCategoryList)
  //   });
  // }
  getSubCategories(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = selectElement.value;
    this.selectedCategory = categoryId;

    //console.log('--------selected---', this.selectedCategory);
    const categoryObj = this.categoryList.find((cat: any) => cat._id === categoryId);
    this.categoryName = categoryObj ? categoryObj?.category_name : '';

    console.log('Selected Category Id:', this.selectedCategory);
    console.log('Selected Category Name:', this.categoryName);
    this.loadSubCategories(categoryId);
  }

  getProductDetails(id: string): void {
    this.commonService.setLoader(true);
    this.usersService.getProductById(id).subscribe((res: any) => {
      const data = res.data;
      this.addAdditionalService.patchValue({
        productName: data.productName,
        //    keyFeatures: data?.keyFeatures,
        description: data.description,
        categoryId: data.categoryId?._id,
        subCategoryId: data.subCategoryId?._id,
        short_description: data?.short_description,
      });

      if (data.categoryId?._id) {
        this.loadSubCategories(data.categoryId._id);

        const categoryObj = this.categoryList.find((cat: any) => cat._id === data.categoryId._id);
        this.categoryName = categoryObj ? categoryObj?.category_name : '';
      }
      if (Array.isArray(data.color)) {
        this.color.clear();
        data.color.forEach((color: any) => {

          this.color.push(this.fb.group({
            name: [color.name, Validators.required],
          }));
        });
      }
      if (Array.isArray(data.colorTemperature)) {
        this.colorTemperature.clear();
        data.colorTemperature.forEach((ct: any) => {
          this.colorTemperature.push(this.fb.group({
            watt: [ct.watt,],
            imageFile: [null], // ImageFile stays null unless user changes it
            image: [ct.image,] // For displaying preview
          }));
        });
      }


      if (Array.isArray(data.specification)) {
        this.specifications.clear();
        data.specification.forEach((spec: any) => {
          // this.specifications.push(this.fb.group(spec));
          this.specifications.push(this.fb.group({
            ratedWattage: [spec.ratedWattage,],
            lumen: [spec.lumen],
            shape: [spec.shape,],
            cutOutSizeInmm: [spec.cutOutSizeInmm],
            powerFactor: [spec.powerFactor],
            colourTemperature: [spec.colourTemperature,],
            housing: [spec.housing],
            beamAngle: [spec.beamAngle,],
            swivelArrangement: [spec.swivelArrangement],
            price: [spec.price],
            availableQuantity: [spec.availableQuantity],
            lengthInMm: [spec.lengthInMm,],
            widthInMm: [spec.widthInMm,],
            protectionClass: [spec.protectionClass],
            cri: [spec.cri],
            stdPkg: [spec.stdPkg,],
            base: [spec?.base,],
            lumenAC: [spec?.lumenAC,],
            lumenDC: [spec?.lumenDC,],


            breaking_capacity: [spec?.breaking_capacity],
            MCB_type: [spec?.MCB_type],
            curve: [spec?.curve],
            pole: [spec?.pole],
            ampere: [spec?.ampere],
            sensitivity: [spec?.sensitivity],
            door_type: [spec?.door_type],
            DB_type: [spec?.DB_type],
            phase: [spec?.phase],
            number_of_way: [spec?.number_of_way],
            module: [spec?.module],
            type: [spec?.type],


            //  New fields from your image
            standardConformity: [spec?.standardConformity],
            noOfPole: [spec?.noOfPole],
            magneticReleaseSetting: [spec?.magneticReleaseSetting],
            methodOfMounting: [spec?.methodOfMounting],
            ratedOperationalVoltage: [spec?.ratedOperationalVoltage],
            ratedCurrent: [spec?.ratedCurrent],
            ratedFrequency: [spec?.ratedFrequency],
            ratedShortCircuitCapacity: [spec?.ratedShortCircuitCapacity],
            maxValueOfI2t: [spec?.maxValueOfI2t],
            ratedInsulationVoltage: [spec?.ratedInsulationVoltage],
            ratedImpulseWithstandsVoltage: [spec?.ratedImpulseWithstandsVoltage],
            materialGroup: [spec?.materialGroup],
            ipCategory: [spec?.ipCategory],
            ambientTemp: [spec?.ambientTemp],
            tighteningTorque: [spec?.tighteningTorque],
            dielectricTestVoltage: [spec?.dielectricTestVoltage],
            energyLimitingClass: [spec?.energyLimitingClass],
            vibration: [spec?.vibration],
            installationPosition: [spec?.installationPosition],
            biConnectTerminal: [spec?.biConnectTerminal],
            lineAndLoadTerminalCapacity: [spec?.lineAndLoadTerminalCapacity],
            resistanceToShock: [spec?.resistanceToShock],
            enduranceMechanicalElectricalCycles: [spec?.enduranceMechanicalElectricalCycles],
          }));
        });
      }
      this.commonService.setLoader(false);
      if (data.image) {
        this.imagesPreview = data.image;
      }
      if (data?.image1) {
        this.imagesPreview1 = data?.image1;
      }
    });
  }
  addAdditionalServices(): void {
    if (this.isSubmitting || this.addAdditionalService.invalid) {
      this.addAdditionalService.markAllAsTouched();
      this.cdRef.detectChanges();

      setTimeout(() => {
        this.scrollToFirstInvalidControl()
      }, 100);
      return;
    }
    this.submitForm('add');
  }

  updateAdditionalService(): void {
    const noImages = !this.uploadedFiles.length && !this.imagesPreview.length;
    //    const noImages1 = !this.uploadedFiles1.length && !this.imagesPreview1.length;
    if (this.isSubmitting || this.addAdditionalService.invalid || noImages) {
      this.addAdditionalService.markAllAsTouched();
      this.cdRef.detectChanges();

      setTimeout(() => {
        this.scrollToFirstInvalidControl();
      }, 100);
      return;
    }

    this.submitForm('update');
  }

  submitForm(action: 'add' | 'update'): void {
    this.isSubmitting = true;
    this.commonService.setLoader(true);
    const val = this.addAdditionalService.value;
    const formData = new FormData();
    formData.append('productName', val.productName);
    formData.append('description', val.description);
    formData.append('short_description', val.short_description);

    formData.append('categoryId', val.categoryId);
    formData.append('subCategoryId', val.subCategoryId);
    formData.append('specification', JSON.stringify(val.specification));
    //  formData.append('keyFeatures', val.keyFeatures);
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
    this.uploadedFiles1.forEach(file => formData.append('image1', file));

    const request = action === 'update'
      ? this.usersService.editProduct(this.productId, formData)
      : this.usersService.addProduct(formData);

    request.pipe(
      catchError((err) => {
        this.snackBar.open(err.error?.message || 'Submission failed', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['green-snackbar']
        });
        // this.snackBar.open(err.error?.message || 'Submission failed', 'OK', { duration: 3000 });
        this.isSubmitting = false;
        this.commonService.setLoader(false);
        return throwError(() => err);
      })
    ).subscribe(res => {
      this.snackBar.open(res?.message || 'Submission failed', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['green-snackbar']
      });
      this.router.navigate(['/pages/product']);
      this.isSubmitting = false;
      this.commonService.setLoader(false);
    });
  }

  resetForm(): void {
    this.addAdditionalService.reset();
    this.uploadedFiles = [];
    this.selectedImages = [];
    this.imagesPreview1 = [];
    this.uploadedFiles1 = [];
    this.selectedImages1 = [];
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

    const invalidFields = getInvalidFields(this.addAdditionalService);

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
  errorMessage: any;
  //  Common function: sirf categoryId lega
  loadSubCategories(categoryId: string) {
    //console.log('=====categoryId======',categoryId)
    if (!categoryId) {
      this.errorMessage = 'Please choose a category first before selecting subcategory.';
      this.subCategoryList = [];
      return;
    }

    this.errorMessage = '';
    this.usersService.getSubcategoryByCateytgeoryId(categoryId).subscribe(
      (data: any) => {
        this.subCategoryList = data.data || [];
        //  console.log('============subCategories-------', this.subCategoryList);
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }



}
