import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  searchText: string = '';
  totalCount = 0;
  limit = 60;
  currentPage = 0;
  dataList: any;
  totalItems = 0;
  pageSize = 5;
  totalPages: number[] = []; // Holds the number of pages

  pageIndex = 0;
  pages: number[] = [];
  constructor(private snackBar: MatSnackBar, private userService: UsersService,) { }
  openDropdownIndex: number | null = null;


  ngOnInit(): void {
    this.getUser(this.currentPage, this.limit)
  }

  getUser(pageIndex: number, pageSize: number) {


    this.userService.getProduct(pageIndex + 1, pageSize).subscribe(
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

  // method to delete user 

  // Logout function
  DeleteAccount(id: any): void {
    if (confirm('Are you sure you want to delete this poduct?')) {
      this.userService.deleteProduct(id).subscribe(
        (response: any) => {
          // console.log('Form submission successful:', response);
          if (response?.status == true) {
            this.snackBar.open(response?.message, 'OK', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['green-snackbar']


            });
            this.getUser(this.currentPage, this.limit);
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


  onPageChange(event: PageEvent): void {
    this.limit = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getUser(this.currentPage, this.limit);
  }

  updatePagination() {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i); // Create an array of page numbers
  }










  toggleStatus(user: any): void {
    this.userService.highlightProduct(user._id).pipe(
      catchError((error: { error: { message: any; }; }) => {
        this.snackBar.open(error.error.message, 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });
        throw error;
      })
    ).subscribe(() => {

      this.snackBar.open('Status updated successfully', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['green-snackbar']
      });
      this.getUser(this.currentPage, this.limit);
    });
  }






  // product.component.ts


  onSearch() {

    let query = this.searchText.trim(); // aage-piche ke spaces hatao
    query = query.replace(/\s+/g, ' '); // multiple spaces ko single space me convert karo


    if (!query) {
      this.getUser(this.currentPage, this.limit); // agar input empty ho jaye toh saara data reload karo
      return;
    }
    this.userService.productSearch(query).subscribe({
      next: (res) => {
      this.dataList = res?.data || [];
      },
      error: (err) => {
        console.error('Search API error:', err);
      }
    });
  }


}



