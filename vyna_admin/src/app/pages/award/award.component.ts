import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.css']
})
export class AwardComponent implements OnInit {

 
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

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }


  getUser() {
    const params = {
      page: this.pageIndex,
      pageSize: this.pageSize,
    };
    // console.log('Params:', params);

    this.userService.getAward(params.pageSize, params.page).subscribe(
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
//console.log('============data;list',this.dataList)
        // Calculate total pages dynamically
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


