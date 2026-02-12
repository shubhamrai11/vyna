import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { CommonService } from 'src/app/core/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-promise-add',
  templateUrl: './promise-add.component.html',
  styleUrls: ['./promise-add.component.css']
})
export class PromiseAddComponent implements OnInit {
config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no'
  };
  promiseForm!: FormGroup;
  isEdit = false;
  isSubmitting = false;
  promiseId: any;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.promiseId = this.activatedRoute.snapshot.params['id'];
    if (this.promiseId) {
      this.isEdit = true;
      this.getPromiseDetails(this.promiseId);
    }
  }

  initializeForm() {
    this.promiseForm = this.fb.group({
      heading: ['', Validators.required],
      description: ['', Validators.required],
      points: this.fb.array([this.createPointGroup()])
    });
  }

  createPointGroup(): FormGroup {
    return this.fb.group({
      icon: ['', Validators.required],           // File or URL
      iconPreview: [''],                         // Preview image
      title: ['', Validators.required],
   //   subtitle: ['', Validators.required],
      description:['',Validators.required]
    });
  }

  get points(): FormArray {
    return this.promiseForm.get('points') as FormArray;
  }

  addPoint(): void {
    this.points.push(this.createPointGroup());
  }

  removePoint(index: number): void {
    if (this.points.length > 1) {
      this.points.removeAt(index);
    }
  }

  getPromiseDetails(id: string): void {
   // this.commonService.setLoader(true);
    this.usersService.getPromiseById(id).subscribe((res: any) => {
      this.commonService.setLoader(false);
      const data = res.data;
      this.promiseForm.patchValue({
        heading: data.heading,
        description: data.description
      });

      this.points.clear();
      data.points.forEach((point: any) => {
        this.points.push(this.fb.group({
          icon: [point.icon, Validators.required],
          iconPreview: [point.icon],
          title: [point.title, Validators.required],
     //     subtitle: [point.subtitle, Validators.required],
            description: [point?.description, Validators.required]
        }));
      });
    });
  }

  onIconUpload(event: any, index: number): void {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      this.snackBar.open('Please upload a valid image file.', 'OK', { duration: 3000 });
      return;
    }

    const point = this.points.at(index);
    point.patchValue({ icon: file });

    const reader = new FileReader();
    reader.onload = () => {
      point.patchValue({ iconPreview: reader.result as string });
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  submitForm(): void {
    if (this.promiseForm.invalid) {
     // this.snackBar.open('Please fill all required fields!', 'OK', { duration: 3000 });
      this.promiseForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
     this.isSubmitting = true;
        this.commonService.setLoader(true);
    formData.append('heading', this.promiseForm.get('heading')?.value);
    formData.append('description', this.promiseForm.get('description')?.value);

    const points = this.points.controls.map((ctrl: any) => {
      const iconFile = ctrl.get('icon')?.value;
      if (iconFile instanceof File) {
        formData.append('pointIcons', iconFile);
      }
      return {
        title: ctrl.get('title')?.value,
        subtitle: ctrl.get('subtitle')?.value,
        description: ctrl.get('description')?.value
      };
    });

    formData.append('points', JSON.stringify(points));

    this.isSubmitting = true;
  this.commonService.setLoader(true);

    const request = this.isEdit
      ? this.usersService.editPromise(this.promiseId, formData)
      : this.usersService.addPromise(formData);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.commonService.setLoader(false);
        this.snackBar.open(`Our Promise ${this.isEdit ? 'updated' : 'added'} successfully`, 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['green-snackbar']
        });
        this.router.navigate(['/pages/promise']);
      },
      error: () => {
        this.isSubmitting = false;
        this.commonService.setLoader(false);
        this.snackBar.open('Something went wrong!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });
      }
    });
  }
}
