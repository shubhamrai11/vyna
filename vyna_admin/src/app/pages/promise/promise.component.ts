import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-promise',
  templateUrl: './promise.component.html',
  styleUrls: ['./promise.component.css']
})
export class PromiseComponent implements OnInit {
 dataList: any;
  totalItems = 0;
  pageSize = 5;
  totalPages: number[] = []; // Holds the number of pages

  totalCount = 0;
  limit = 20;
  currentPage = 0;
  pageIndex = 0;
  pages: number[] = [];
  constructor(private snackBar: MatSnackBar, private userService: UsersService,) { }
  openDropdownIndex: number | null = null;


  ngOnInit(): void {
    this.getUser(this.currentPage, this.limit)
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }


  getUser(pageIndex: number, pageSize: number) {
   
    this.userService.getPromsie(pageIndex + 1, pageSize).subscribe(
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
        //   console.log('User data response:', response);
        this.dataList = response?.data;
 this.totalCount = response.totalCount;
        this.limit = response.limit;
        this.currentPage = response.currentPage - 1;
        
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

  onPageChange(event: PageEvent): void {
    this.limit = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getUser(this.currentPage, this.limit);
  }


  updatePagination() {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i); // Create an array of page numbers
  }



  // Logout function
  DeleteAccount(id: any): void {
    if (confirm('Are you sure you want to delete this philospy?')) {
      this.userService.deletePromsie(id).subscribe(
        (response: any) => {
          // console.log('Form submission successful:', response);
          if (response?.status ==true) {
            this.snackBar.open(response?.message, 'OK', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['green-snackbar']


            });
            this.getUser(this.currentPage, this.limit)
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


