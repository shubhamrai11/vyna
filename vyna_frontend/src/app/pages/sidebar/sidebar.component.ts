import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { filter } from 'rxjs/operators';
import { Profile } from 'src/app/core/models/userType';

declare var $: any; // Declare jQuery globally to avoid TypeScript errors

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  windowWidth = window.innerWidth; // Track window width
  userManagement: any = {};
  currentProfile: any;
  currentRouteApplicationTrackingManagement: boolean = false;
  currentRouteAgenceManagement: boolean = false;
  currentRouteUserManagement: boolean = false;
  currentRouteProjectManagement: boolean = false;
  activeRoute: any;
  // Other properties...

  constructor(private router: Router, private authservice: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;

      this.currentProfile = localStorage?.getItem("profile");

      // Check for '/pages/administrator' or paths that start with '/pages/edit-user'
      this.currentRouteApplicationTrackingManagement = currentUrl.startsWith('/pages/application-tracking');
      this.currentRouteAgenceManagement = currentUrl.startsWith('/pages/administration/agence');
      this.currentRouteUserManagement = currentUrl === '/pages/administrator' || currentUrl.startsWith('/pages/edit-user');
      this.currentRouteProjectManagement = currentUrl === '/pages/project-create' || currentUrl.startsWith('/pages/phases-details')
        || currentUrl.startsWith('/pages/documents-details')
        || currentUrl.startsWith('/pages/project') || currentUrl.startsWith('/pages/property')
        || currentUrl.startsWith('/pages/add-well') || currentUrl.startsWith('/pages/plan-payment')
        || currentUrl.startsWith('/pages/import-well') || currentUrl.startsWith('/pages/image');

    });

  }

  ngOnInit(): void {
    // Call the jQuery function for activating the menu item
    $('.nav-item').off('click').on('click', () => {

      // $('.nav-item').removeClass('active');
      //   console.log('======================')
      $(this).addClass('active');
    });

    // Add window resize listener
    window.addEventListener('resize', this.onResize.bind(this));
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.setSidebarCollapsedStyles();
    } else {
      this.setSidebarExpandedStyles();
    }
  }

  private setSidebarCollapsedStyles(): void {
    const content = document.querySelector('.mat-drawer-content') as HTMLElement;
    const drawer = document.querySelector('.mat-drawer') as HTMLElement;
    content.style.marginLeft = '60px'; // Adjust this value based on your sidebar width
    drawer.style.width = '60px'; // Adjust this value based on your sidebar width
  }

  private setSidebarExpandedStyles(): void {
    const content = document.querySelector('.mat-drawer-content') as HTMLElement;
    const drawer = document.querySelector('.mat-drawer') as HTMLElement;
    content.style.marginLeft = '210px'; // Adjust this value based on your sidebar width
    drawer.style.width = '210px'; // Adjust this value based on your sidebar width
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  private onResize(): void {
    this.windowWidth = window.innerWidth; // Update the tracked window width
    // Optional: Collapse if the screen is less than 480px
    if (this.windowWidth < 480 && !this.isCollapsed) {
      this.toggleSidebar(); // Collapse if the screen is less than 480px
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
    // Clean up the jQuery event listener on component destroy
    $('.nav-item').off('click');
  }


  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}