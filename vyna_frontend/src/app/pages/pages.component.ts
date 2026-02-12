import { Component, OnInit } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor(private commonservice:CommonService ,private router: Router,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const expirationTime = Number(localStorage.getItem('expirationTime'));
    if (expirationTime && Date.now() > expirationTime) {
      this.logout();
    }
  }
  // Logout function
  logout(): void {
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
   
    this.snackBar.open('Session expired. Please log in again.', 'ok', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar']
    });

    /*this.router.navigateByUrl('/').then(() => {
      // Reload the page to ensure you go back to the home page
      window.location.reload();
    });   
    */
    
    this.router.navigate(['/']);
  }
  
}
