import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {


  dataList: any;
  totalItems = 0;
  pageSize = 5;
  totalPages: number[] = []; // Holds the number of pages

  pageIndex = 0;
  pages: number[] = [];
  constructor(private snackBar: MatSnackBar, private userService: UsersService,) { }
  openDropdownIndex: number | null = null;


  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    const params = {
      page: this.pageIndex,
      pageSize: this.pageSize,
    };
    // console.log('Params:', params);

    this.userService.getAboutUs(params.pageSize, params.page).subscribe(
      (response: any) => {
        if (response?.status !== 'success') {
          this.snackBar.open('Unexpected response format', 'OK', {
            duration: 2000,
            verticalPosition: 'bottom',  // Change to 'bottom'
            horizontalPosition: 'right',
            panelClass: ['red-snackbar'],
          });
          return;
        }
       
        this.dataList = response?.data;

        const totalPages = Math.ceil(response?.data / this.pageSize);
        this.pages = Array.from({ length: totalPages }, (_, i) => i);
        //        console.log('Pages:', this.pages);

        // this.snackBar.open(response?.message, 'ok', {
        //   duration: 2000,
        //   verticalPosition: 'top',  // Change to 'bottom'
        //   horizontalPosition: 'right',
        //   panelClass: ['green-snackbar'],
        // });
      },
      (error: any) => {
        //    console.error('get failed------------:', error?.error?.message);
        this.snackBar.open(error?.error?.message, 'OK', {
          duration: 2000,
          verticalPosition: 'top',  // Change to 'bottom'
          horizontalPosition: 'right',
          panelClass: ['red-snackbar'],
        });
      }
    );

  }

  // method to delete user 

  // Logout function
  DeleteAccount(id: any): void {
    if (confirm('Are you sure you want to Delete this Product?')) {
      this.userService.deleteProduct(id).subscribe(
        (response: any) => {
          // console.log('Form submission successful:', response);
          if (response?.status ==true) {
            this.snackBar.open(response?.message, 'OK', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['green-snackbar']


            });
            this.getUser()
          } else {
            // console.log('=========')
            this.snackBar.open('Unexpected response format', 'OK', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['red-snackbar']
            });
          }
          // Optionally, navigate or show a success message
        },
        (error: any) => {
          console.error(' submission failed:', error);
          // Optionally, show an error message
        }
      );

    }
  }

  onPageChange(index: number) {
    if (index >= 0 && index < this.pages.length) {
      this.pageIndex = index;
      this.getUser(); // Call the API with updated page index
    }
  }

  updatePagination() {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i); // Create an array of page numbers
  }









getTrimmedDescription(html: string): string {
  if (!html) return '';

  // Create a temporary element to extract plain text
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';

  const trimmedText = text.slice(0, 50);
  return trimmedText + (text.length > 50 ? '...' : '');
}



}



