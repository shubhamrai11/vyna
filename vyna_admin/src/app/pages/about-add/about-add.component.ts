import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { CommonService } from 'src/app/core/services/common.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-about-add',
  templateUrl: './about-add.component.html',
  styleUrls: ['./about-add.component.css']
})
export class AboutAddComponent implements OnInit {
  @ViewChild('formElement') formElement!: ElementRef;
  formSubmitted: boolean = false;
  aboutForm!: FormGroup;
  isEdit = false;
  scrollAfterCheck: boolean = false;

  userId: any;
  uploadedPreview:  any[] = [];
  selectedImagePreview: any[] = [];
  uploadImages:any[]=[];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no'
  };

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.aboutForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [[]],
      aboutValues: this.fb.array([])
    });

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.isEdit = true;
        this.getCategoryById();
      } else {
        this.addPoint();
      }
    });
  }

  get aboutValues(): FormArray {
    return this.aboutForm.get('aboutValues') as FormArray;
  }

  createPoint(data: any = {}): FormGroup {
    return this.fb.group({
      icon: [data.icon || null],
      iconPreview: [data.preview || null],
      title: [data.title || '', Validators.required],
      subtitle: [data.subtitle || '', Validators.required]
    });
  }
ngAfterViewChecked(): void {
  if (this.scrollAfterCheck) {
    console.log('==scrollAfterCheck=======------------------==',this.scrollAfterCheck)
    this.scrollToFirstInvalidControl();
    this.scrollAfterCheck = false; // Reset flag
  }
}

  addPoint(): void {
    this.aboutValues.push(this.createPoint());
  }

  removeAboutValue(index: number) {
    this.aboutValues.removeAt(index);
  }

  getCategoryById() {
    this.usersService.getAboutusById(this.userId).subscribe(
      (res: any) => {
        const data = res.data;
        this.aboutForm.patchValue({
          title: data?.title,
          description: data?.description,
          //  image: (data?.image || []).map((img: any) => img.url)
        });
        this.selectedImagePreview = data?.image || [];
        this.aboutValues.clear();
        const points = data?.aboutValues || [];
        if (points.length) {
          points.forEach((pt: any) => {
            this.aboutValues.push(this.createPoint({
              icon: pt.icon,
              preview: pt.icon,
              title: pt.title,
              subtitle: pt.subtitle
            }));
          });
        } else {
          this.addPoint();
        }

        if (data?.image) {
          this.selectedImagePreview = data.image;
        }
      },
      (err: any) => {
        console.error('Error loading about page data', err);
      }
    );
  }
  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.uploadImages.push(...files); // ✅ FIXED

      const readers = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(images => {
        const current = this.aboutForm.get('image')?.value || [];
        this.aboutForm.get('image')?.setValue([...current, ...images]);
        this.uploadedPreview.push(...images);
       // console.log("-------------------",this.uploadedPreview)
      });
    }
  }


  onIconSelect(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const group = this.aboutValues.at(index) as FormGroup;
        group.get('icon')?.setValue(file);
        group.get('iconPreview')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: any): void {
    const images = [...this.aboutForm.get('image')?.value];
    images.splice(index, 1);
    this.aboutForm.get('image')?.setValue(images);
    this.selectedImagePreview.splice(index, 1);
    this.deleteItem(index._id)

  }
  deleteItem(assetId: any): void {
    //console.log('=======assetId======', assetId)
    // if (confirm('Are You Sure You Want To Delete This Asset Management?')) {
    this.usersService.deleteAboutImage(this.userId, assetId)
      .pipe(
        catchError((error) => {
          throw error;
        })
      )
      .subscribe((data: any) => {
        this.getCategoryById();
      });
    // }
  }
  saveAbout(): void {
 if (this.aboutForm.invalid) {
    this.aboutForm.markAllAsTouched();
    this.cdRef.detectChanges(); // Force Angular to update the view
    setTimeout(() => {
      console.log('================= scrolling now ======');
      this.scrollToFirstInvalidControl();
    }, 0);

    return;
  }



    

    const formData = new FormData();
    const formValue = this.aboutForm.value;
    this.formSubmitted = true;
    this.commonService.setLoader(true);
    formData.append('title', formValue.title);
    formData.append('description', formValue.description);

    this.uploadImages.forEach(file => {
      formData.append('image', file);
    });

    const pointsPayload: any[] = [];
    this.aboutValues.controls.forEach((control: any) => {
      const icon = control.get('icon')?.value;
      if (icon instanceof File) {
        formData.append('pointIcons', icon);
      }
      pointsPayload.push({
        title: control.get('title')?.value,
        subtitle: control.get('subtitle')?.value
      });
    });

    formData.append('aboutValues', JSON.stringify(pointsPayload));

    const request = this.userId
      ? this.usersService.editAbout(this.userId, formData)
      : this.usersService.addAbout(formData);

    //  this.commonService.setLoader(true);
    request.pipe(
      catchError(err => {
        this.formSubmitted = false;
        this.commonService.setLoader(false);
        this.snackBar.open(err.error.message || 'Error', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });
        return throwError(() => err);
      })
    ).subscribe((data: any) => {
       this.formSubmitted = false;
      this.commonService.setLoader(false);
      this.snackBar.open(data.message, 'OK', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: 'green-snackbar'
      });
      this.router.navigate(['/pages/about']);
    });
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

    const invalidFields = getInvalidFields(this.aboutForm);

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
