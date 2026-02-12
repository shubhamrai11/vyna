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
  currentRouteCMSbanner:boolean=false;
  currentRouteAgenceManagement: boolean = false;
  currentRouteUserManagement: boolean = false;
  currentRouteContact: boolean = false;
  currentRouteNews: boolean = false;
  currentRoutefaq: boolean = false;
  currentRoutebanner: boolean = false;
  currentRoutevision: boolean = false;
   currentRouteContactUs: boolean = false;
  currentRoutecategory: boolean = false;
  currentRouteabout: boolean = false;
  currentRouteWhoWeAre: boolean = false;
  currentRoutepromise: boolean = false;
  currentRouteproduct: boolean = false;
  currentRoutesubcategory: boolean = false;
  currentRouteProjectManagement: boolean = false;
  currentRouteAwards: boolean = false;
  currentRoutesustainability:boolean = false;
  activeRoute: any;
  // Other properties...
  currentRouteInquery : boolean = false;
  currentRouteContent : boolean = false;

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
      this.currentRouteContact = currentUrl === '/pages/contact' || currentUrl.startsWith('/pages/contact-add/edit');
      this.currentRouteNews = currentUrl === '/pages/newsletter';
      this.currentRoutefaq = currentUrl === '/pages/faq' || currentUrl.startsWith('/pages/faq-add') || currentUrl.startsWith('/pages/faq-add/edit');

      this.currentRoutebanner = currentUrl === '/pages/banner' || currentUrl.startsWith('/pages/banner-add') || currentUrl.startsWith('/pages/banner-add/edit');
      this.currentRoutecategory = currentUrl === '/pages/category' || currentUrl.startsWith('/pages/category-add') || currentUrl.startsWith('/pages/category-add/edit') ||currentUrl.startsWith('/pages/category-view/');
      this.currentRoutesubcategory = currentUrl === '/pages/subcategory' || currentUrl.startsWith('/pages/subcategory-add') || currentUrl.startsWith('/pages/subcategory-add/edit')||currentUrl.startsWith('/pages/subcategory-view/');
      this.currentRoutevision = currentUrl === '/pages/vision' || currentUrl.startsWith('/pages/vision-add') || currentUrl.startsWith('/pages/vision-add/edit');
      this.currentRouteAwards = currentUrl === '/pages/award' || currentUrl.startsWith('/pages/award-add') || currentUrl.startsWith('/pages/award-add/edit');
this.currentRouteInquery =  currentUrl === '/pages/inquery' || currentUrl.startsWith('/pages/inquery-view');

this.currentRouteContent =  currentUrl === '/pages/content' || currentUrl.startsWith('/pages/content-view');
this.currentRouteContactUs = currentUrl === '/pages/contact-us-form' || currentUrl.startsWith('/pages/contact-us-view');

this.currentRouteCMSbanner =  currentUrl === '/pages/cms-banner' || currentUrl.startsWith('/pages/cms-banner-add') || currentUrl.startsWith('/pages/cms-banner-add/edit');
this. currentRouteWhoWeAre = currentUrl === '/pages/who-we-are' || currentUrl.startsWith('/pages/who-we-are-add') || currentUrl.startsWith('/pages/who-we-are-add/edit');
this.currentRoutesustainability =currentUrl === '/pages/sustanbility'|| currentUrl.startsWith('/pages/sustanbility') || currentUrl.startsWith('/pages/sustanbility-add/edit');




      this.currentRouteabout = currentUrl === '/pages/about' || currentUrl.startsWith('/pages/about-add') || currentUrl.startsWith('/pages/about-add/edit');
      this.currentRoutepromise = currentUrl === '/pages/promise' || currentUrl.startsWith('/pages/promise-add') || currentUrl.startsWith('/pages/promise-add/edit');
      this.currentRouteproduct = currentUrl === '/pages/product' || currentUrl.startsWith('/pages/product-add') || currentUrl.startsWith('/pages/product-add/edit') ||currentUrl.startsWith('/pages/product-view/');
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