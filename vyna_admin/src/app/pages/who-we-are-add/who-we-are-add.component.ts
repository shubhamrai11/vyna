import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/core/services/common.service';
import { catchError } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { throwError } from 'rxjs';
@Component({
  selector: 'app-who-we-are-add',
  templateUrl: './who-we-are-add.component.html',
  styleUrls: ['./who-we-are-add.component.css']
})
export class WhoWeAreAddComponent implements OnInit {
  imagePreviews: any[] = [];

  userId: any;
  userAddForm!: FormGroup;
  isEdit: boolean = false;
  formSubmitted: boolean = false;

  selectedFile: any;
  imagePreview:any;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private router: Router
  ) { }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no'
  };
  ngOnInit(): void {
    this.userAddForm = this.fb.group({
      image: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],

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
    this.usersService.getWhoWeAreById(this.userId).subscribe(
      (data: any) => {
        this.userAddForm.patchValue({ image: data.data.image, content: data.data?.description, title: data.data?.title });
        this.imagePreviews = data.data.image.map((img: any) => img);


        //console.log('--------- this.imagePreview -------', this.imagePreviews);

      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }
  selectedFiles: File[] = [];

  imageErrors: string[] = [];

  onFileChange(event: any) {
    const files = event.target.files;
    this.selectedFiles = [];
    this.imagePreview = [];
    this.imageErrors = [];

    if (files && files.length > 0) {
      let processedCount = 0;

      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            this.selectedFiles.push(file);
            this.imagePreview.push(reader.result as string);
            console.log('this.console---------',this.imagePreview)
            // const width = img.width;
            // const height = img.height;

            // const minWidth = 1880;
            // const maxWidth = 2000;
            // const minHeight = 600;
            // const maxHeight = 900;

            // if (
            //   width >= minWidth && width <= maxWidth &&
            //   height >= minHeight && height <= maxHeight
            // ) {
            //   this.selectedFiles.push(file);
            //   this.imagePreviews.push(reader.result as string);
            // } else {
            //   this.imageErrors.push(
            //     `${file.name}: Invalid dimensions (${width}x${height}). Allowed: ${minWidth}-${maxWidth} x ${minHeight}-${maxHeight}`
            //   );
            // }

            processedCount++;
            // ✅ Only update the form once all files processed
            if (processedCount === files.length) {
              if (this.selectedFiles.length > 0) {
                this.userAddForm.get('image')?.setValue(this.selectedFiles);
                this.userAddForm.get('image')?.setErrors(null);
              } else {
                this.userAddForm.get('image')?.setValue(null);
                this.userAddForm.get('image')?.setErrors({ required: true });
              }
            }
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit(): void {
    

    if (this.userAddForm.invalid || !this.isEdit && this.selectedFiles.length === 0) {

      return;
    }
    this.formSubmitted = true;
      this.commonService.setLoader(true);
    const formData = new FormData();
    this.selectedFiles.forEach((file) => {
      formData.append('image', file);
    });
    formData.append('title', this.userAddForm.value.title);
    formData.append('description', this.userAddForm.value.content);
    const apiCall = this.userId
      ? this.usersService.editWhoWeAre(this.userId, formData)
      : this.usersService.addWhoWeAre(formData);

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
      this.formSubmitted = false;
      this.commonService.setLoader(false);
      this.snackBar.open(data.message, 'OK', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['green-snackbar']
      });
      this.router.navigate(['/pages/who-we-are']);
    });
  }
  removeImage(img: any): void {
    if (this.imagePreviews) {
      this.imagePreviews = this.imagePreviews.filter(i => i !== img);
    }
    this.deleteItem(img._id);
  }


  deleteItem(assetId: any): void {
    //console.log('=======assetId======', assetId)
    // if (confirm('Are You Sure You Want To Delete This Asset Management?')) {
    this.usersService.deleteWhoWeAreImage(this.userId, assetId)
      .pipe(
        catchError((error) => {
          throw error;
        })
      )
      .subscribe((data: any) => {
        this.getUserById();


      });
    // }
  }


}

