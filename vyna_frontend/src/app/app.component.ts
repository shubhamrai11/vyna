import { Component, HostListener, Input, OnInit } from '@angular/core';
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
  title = 'VynaAdminpanel';
  results: any;
  error: any;
  // isLoading: boolean = false;

  constructor(private translate: TranslateService, private commonservice: CommonService, private router: Router, private snackBar: MatSnackBar) {

  }


    isLoading = false;
  showScrollTop = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    const expirationTime = Number(localStorage.getItem('expirationTime'));
    if (expirationTime && Date.now() > expirationTime) {
      // this.logout();
    }
  }

  fetchData(): void {
    this.error = null;
    this.results = '';
    this.isLoading = true;

  }

}
