import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
declare const $: any; // If using jQuery
import { environment } from 'src/environments/environment.prod';
import { AfterViewInit, Component,OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('owlCarousel', { static: false }) owlCarousel!: ElementRef;
  imageList: any; // Store images mapped to project IDs
  imageAssociate:any
  defaultImage =`./assets/images/featured-properties-08-480x287.jpg`
  id: any;
  isSubmited:boolean=true;
  projectData: any;
  associateProperty: any;
  mediaPath = environment.mediaUrl
  constructor(private activatedRoute: ActivatedRoute, private usersService: UsersService, private snackBar: MatSnackBar,private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.getProject();
      this.getAssociatePropertyList();
      this.getProjectImage(this.id)
    });
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges(); // Ensure Angular detects changes
    this.initializeOwlCarousel();
  }
  initializeOwlCarousel(): void {
    setTimeout(() => { // Ensure the DOM is updated before initializing
      if (this.owlCarousel) {
        ($(this.owlCarousel.nativeElement) as any).owlCarousel({
      //    loop: true,
          margin: 10,
          nav: true,
          // responsive: {
          //   0: { items: 1 },
          //   600: { items: 2 },
          //   1000: { items: 3 }
          // },
          dots: true
        });
      }
    }, 500); // Give Angular time to render content
  }


  //method to get project data

  getProject() {
    this.usersService.getProject(this.id).subscribe(
      (data: any) => {
        this.projectData = data?.data;
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }



  private handleError(error: any) {
    //  console.log('message--error--',error)
    this.isSubmited = false;
    let errorMessage = error; // Default message

    if (error?.error?.object) {
      const errorObject = error.error.object;

      // If the error object is an object, extract the first key
      if (typeof errorObject === 'object') {
        const firstKey = Object.keys(errorObject)[0];
        errorMessage = errorObject[firstKey];
      }
      // If it's a string, directly set it as the error message
      else if (typeof errorObject === 'string') {
        errorMessage = errorObject;
      }
    } else if (error.error?.message) {
      //console.log('====',error?.error?.message)
      errorMessage = error?.error?.message;
    }

    // Open the modal to show the error
   // this.modelOpen();  // Ensure the modal stays open when there is an error

    // Show the error message in a Snackbar
    this.snackBar.open(errorMessage, 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar']
    });
  }
  //method to get associate property 

  getAssociatePropertyList() {

    // console.log('this.id---',this.id)
    this.usersService.getAssociateProperty(this.id).subscribe(
      (data: any) => {
        // handle your associateProperty here
      // console.log('Fetched associateProperty-:', data?.data);
        this.associateProperty = data?.data
      },
      (error: any) => {
        //this.handleError(error);
      }
    );
  }




  // method to get project images list 

  getProjectImage(projectId: any) {

    this.usersService.getProjectImage(projectId).subscribe(
      (response: any) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.imageList = response.data
          console.log('Processed Image List:', this.imageList);
        }
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  
  }
  

}
