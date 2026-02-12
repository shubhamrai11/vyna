import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-well',
  templateUrl: './add-well.component.html',
  styleUrls: ['./add-well.component.css']
})
export class AddWellComponent implements OnInit {
  propertyAddForm!: FormGroup;
  projectId: any;
  imagesList: any[] = []; // Store dynamic images
  selectedFile: any[] = [];
  viabilisations: any;
  totalItems = 0;
  
  pageSize = 100;
  projectList: any;
  pageIndex = 0;
  today: string = new Date().toISOString().split('T')[0];

  pages: number[] = [];
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UsersService,) { }

  ngOnInit(): void {
    this.getviabilisationsList();
    this.getProjectList()
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      //this.getProject();
    });
    this.propertyAddForm = this.fb.group({
      nom: ['', Validators.required],
      type: ['', Validators.required],
      ville: ['', Validators.required],
      superficie: ['', Validators.required],
      prix: ['', Validators.required],
      viabilisationId: ['', Validators.required],
      DateMiseDisposition: ['', Validators.required],
      description: ['', Validators.required],
      project: ['', Validators.required],
      adresse: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      statut: ['', Validators.required],
      images: this.fb.array([]) // Initialize the images file
    });

  }
  // Method to create an image form group
  createImage(): FormGroup {
    return this.fb.group({
      // description: ['', Validators.required],
      isdefault: ['', Validators.required],
      file: ['',],
    });
  }


  // Getter for images FormArray
  get images() {
    return (this.propertyAddForm.get('images') as FormArray);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files) {
      // Clear existing images
      this.images.clear();
      this.selectedFile = event.target.files;  // 'event.target.files' contains the list of files selected

      // Add each selected file to the images FormArray
      Array.from(files).forEach((file, index) => {
        this.images.push(this.fb.control(file));
      });
    }
  }


  // Function to add a new image group to the form and display dynamically
  addImage(): void {
    const newImage = this.propertyAddForm.value.images[0];
    this.imagesList.push({
      description: newImage.description,
      defaultImage: newImage.defaultImage,
      file: newImage.file,
    });
    this.propertyAddForm.controls['images'].setValue([{
      description: '',
      defaultImage: '',
      file: ''
    }]);
  }

  // Function to remove an image from the list
  removeImage(index: number): void {
    this.imagesList.splice(index, 1);
  }
  addProperty() {
    if (!this.propertyAddForm.valid) {
      this.propertyAddForm.markAllAsTouched();
      return;
    }
    const project = this.propertyAddForm.get('project')?.value
    const formData = this.createFormData();
    // console.log('===========project======', project);

    this.userService.addProperty(project, formData).subscribe(
      (response: any) => {
        if (response?.status == 'success') {
          this.snackBar.open(response?.message, 'ok', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['green-snackbar']
          });
          this.router.navigate(['pages', 'project-details',this.projectId]);
        } else {
          console.log('Unexpected response format:', response);
          this.snackBar.open('Unexpected response format', 'ok', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['red-snackbar']
          });
        }
      },
      (error: any) => {
        console.error('Form submission failed:', error);
      }
    );
  }

  // Fetch viabilisations list
  getviabilisationsList() {
    const params = {
      page: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.userService.getviabilisations(params.page, params.pageSize).subscribe(
      (response) => {
        this.viabilisations = response.data?.dataList;
      },
      (error) => {
        console.error('Error fetching notaire list', error);
      }
    );
  }

  // Prepare FormData for submission
  createFormData(): FormData {
    const formData = new FormData();
    //console.log('thi?.value',this.projectAddForm.get('viabilisationId')?.value)
    formData.append('description', this.propertyAddForm.get('description')?.value);
    formData.append('nom', this.propertyAddForm.get('nom')?.value);
    formData.append('adresse', this.propertyAddForm.get('adresse')?.value);
    formData.append('viabilisation.id', this.propertyAddForm.get('viabilisationId')?.value);
    formData.append('ville', this.propertyAddForm.get('ville')?.value)
    formData.append('prix', this.propertyAddForm.get('prix')?.value)
    formData.append('latitude', this.propertyAddForm.get('latitude')?.value)
    formData.append('longitude', this.propertyAddForm.get('longitude')?.value)
    formData.append('statut', this.propertyAddForm.get('statut')?.value);

    formData.append('superficie', this.propertyAddForm.get('superficie')?.value)
    formData.append('type', this.propertyAddForm.get('type')?.value)

    const dateFields = ['DateMiseDisposition',];  // Add all your date field names here

    // Loop through date fields and format them before appending to FormData
    dateFields.forEach(field => {
      const date = this.propertyAddForm.get(field)?.value;
      if (date) {
        const formattedDate = this.formatDate(date);  // Call the reusable format function
        formData.append(field, formattedDate);  // Append formatted date to FormData
      }
    });


    this.images.controls.forEach((control, index) => {
      if (this.selectedFile && this.selectedFile[index]) {
        const file = this.selectedFile[index];
        formData.append(`images[${index}].isdefault`, 'true');
        formData.append(`images[${index}].file`, file);  // Append the actual file, not 'undefined'
      }
    });


    return formData;
  }


  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const day = d.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }





  // get project

  // Fetch Project list
  getProjectList() {
    const params = {
      page: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.userService.getprojectList(params.page, params.pageSize).subscribe(
      (response) => {


        // Ensure the list exists before filtering
        this.projectList = (response?.data?.dataList as any[])?.filter(
          (project: any) => project.statut === "EN_COURS"
        );

      },
      (error) => {
        console.error('Error fetching notaire list', error);
      }
    );
  }

}
