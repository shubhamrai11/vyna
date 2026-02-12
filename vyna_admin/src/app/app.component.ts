import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from './core/services/common.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'housemanagementAdminpanel';
  results: any;
  error: any;
  isLoading: boolean = false;

  constructor(private translate: TranslateService, private commonservice: CommonService, private router: Router, private snackBar: MatSnackBar) {

    this.commonservice.getLoader().subscribe(
      (res: any) => {
        console.log('Results:', res);
        this.isLoading = res;
      }
    )

    const browserLang = translate.getBrowserLang() || 'en';
    translate.setDefaultLang('en');
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    const expirationTime = Number(localStorage.getItem('expirationTime'));
    if (expirationTime && Date.now() > expirationTime) {
      this.logout();
    }
  }

  fetchData(): void {
    this.error = null;
    this.results = '';
    this.isLoading = true;

  }
  // Logout function
  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('expirationTime');

    this.snackBar.open('Session expired. Please log in again.', 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar']
    });
    this.router.navigateByUrl('/').then(() => {
      // Reload the page to ensure you go back to the home page
      window.location.reload();
    });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

}
