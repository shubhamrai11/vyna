import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Dropdown } from 'bootstrap';
import { UsersService } from '../../core/services/users.service';
import { DatePipe } from '@angular/common';
declare var google: any; //  Add this at the top

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  isNotificationDropdownOpen = false;
  isProfileMenuOpen: boolean = false;
  isProfileDropdownOpen = false;
  notificationListing: any;
  username: any;
  userEmail: any;
  profile: any;
  constructor(private router: Router, private datePipe: DatePipe, private snackBar: MatSnackBar, private userService: UsersService,) { }
  isSidebarOpen = false;
  isDropdownOpen: boolean = false; // Track dropdown state
  userId: any
  ngOnInit(): void {
    this.username = localStorage?.getItem("name");
    this.userEmail = localStorage?.getItem("email");
    this.profile = localStorage?.getItem("profile");
    this.getUser()
  }





  // Auto-logout function
  autoLogout(expirationDuration: number): void {
    setTimeout(() => {
      //this.logout();

      localStorage.removeItem('admin_token');
      localStorage.removeItem('profile');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      this.router.navigate(['/']);
    }, expirationDuration);
  }

  // Logout function
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin_token');

      this.router.navigateByUrl('/').then(() => {
        // Reload the page to ensure you go back to the home page
        //    window.location.reload();
      });
      this.snackBar.open('Please log in again.', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['red-snackbar']
      });
      //   window.location.reload();
    }
  }

  toggleSidebar() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isNotificationDropdownOpen = false;
    this.isProfileDropdownOpen = false;
    // console.log('Dropdown state toggled:', this.isDropdownOpen);
  }


  toggleProfileMenuDropdown() {
    // Close the notification dropdown if it's open
    this.isNotificationDropdownOpen = false;
    this.isDropdownOpen = false;
    // Toggle the profile dropdown
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toggleNotificationDropdown() {
    // Close the profile dropdown if it's open
    this.isProfileDropdownOpen = false;
    this.isDropdownOpen = false;
    // Toggle the notification dropdown
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
  }


  getUser() {
    this.userService.getAdmin().subscribe(
      (data: any) => {
        if (data?.data.avatar) {
          this.username = data?.data.first_name,
            this.profile = data?.data?.avatar;
        }
      },
      (error: any) => {
       // if (error?.error?.message == "The user belonging to this token does no longer exist") {
          localStorage.removeItem('admin_token');

      this.router.navigateByUrl('/').then(() => {
       
      });
        
      }
    );
  }

}