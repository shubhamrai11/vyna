import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/core/services/common.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { sequence } from '@angular/animations';

@Component({
  selector: 'app-banner-add',
  templateUrl: './banner-add.component.html',
  styleUrls: ['./banner-add.component.css']
})
export class BannerAddComponent implements OnInit {
  userId: any;
  userAddForm!: FormGroup;
  isEdit: boolean = false;
  formSubmitted: boolean = false;

  selectedFile: any;
  imagePreview: string | ArrayBuffer | null = null;

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
    this.userAddForm = this.fb.group({
      image: [null, Validators.required],
      sequence: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$")]],
      role: ['', Validators.required]

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
    this.usersService.getBannerById(this.userId).subscribe(
      (data: any) => {
        this.userAddForm.patchValue({ image: data.data.image, sequence: data?.data?.sequence, role: data?.data?.role });
        this.imagePreview = data.data.image; // Set preview
      },
      (error: any) => {
        console.log('error => ', error);
      }
    );
  }
  imageError: string = '';



  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) {
      // No file selected
      this.selectedFile = null;
      this.imagePreview = null;
      this.imageError = 'Image or video is required.';
      this.userAddForm.get('image')?.setValue(null);
      this.userAddForm.get('image')?.setErrors({ required: true });
      return;
    }

    const fileType = file.type;

    // Check if file is image or video
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');

    if (!isImage && !isVideo) {
      this.imageError = 'Only image or video files are allowed.';
      this.selectedFile = null;
      this.imagePreview = null;
      this.userAddForm.get('image')?.setValue(null);
      this.userAddForm.get('image')?.setErrors({ invalidFileType: true });
      return;
    }

    if (isImage) {
      // Image dimension validation
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;


          this.selectedFile = file;
          this.imagePreview = reader.result;
          this.imageError = '';
          this.userAddForm.get('image')?.setValue(file);
          this.userAddForm.get('image')?.setErrors(null);

        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);

    } else if (isVideo) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile = file;
        this.imagePreview = reader.result; // ✅ Set preview for video
        this.imageError = '';
        this.userAddForm.get('image')?.setValue(file);
        this.userAddForm.get('image')?.setErrors(null);
      };
      reader.readAsDataURL(file); //  Create base64 preview
    }
  }

  onSubmit(): void {
    // Only show image error in Add mode
    if (this.userAddForm.invalid || (!this.selectedFile && !this.isEdit)) {


      this.userAddForm.markAllAsTouched();
      if (!this.selectedFile && !this.isEdit) {
        this.imageError = 'Please upload banner.';
      }
      this.userAddForm.get('image')?.markAsTouched(); // Show validation error
      return;
    }

    this.formSubmitted = true;
    this.commonService.setLoader(true);

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);


    }
    formData.append('role', this.userAddForm.get('role')?.value);
    formData.append('sequence', this.userAddForm.get('sequence')?.value);
    const apiCall = this.userId
      ? this.usersService.editBanner(this.userId, formData)
      : this.usersService.addBanner(formData);

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
      this.router.navigate(['/pages/banner']);
    });
  }


  isVideoFile(file: string | ArrayBuffer | null): boolean {
    if (!file || typeof file !== 'string') return false;
    return file.startsWith('data:video') || /\.(mp4|mov|webm|ogg)$/i.test(file);
  }

}
