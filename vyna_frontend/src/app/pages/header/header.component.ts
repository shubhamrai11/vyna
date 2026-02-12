import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Dropdown } from 'bootstrap';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/services/http.service';
declare var google: any; // 👈 Add this at the top
import { of } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  constructor(private router: Router, private snackBar: MatSnackBar, private httpsService: HttpService ) { }
  isSidebarOpen = false;
  isDropdownOpen: boolean = false; // Track dropdown state
  userId: any
    searchText: string = '';
  products: any[] = [];
  searched = false;
    private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
isMenuDropdownOpen: boolean = false;

  parentOpen = false;

  // 🔹 Subcategories ke liye (multiple open allowed)
  private openSet = new Set<number>();

//     category: any[] = [];

// activeCategory: string = 'lighting';


  category: any[] = [];
subCategories: { [key: string]: any[] } = {}; 
  activeCategoryId: string | null = null;

  
  ngOnInit(): void {
    this.getCategory();

      this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    this.closeDropdown();
    this.closeMenuDropdown();
  });



        this.searchSubject.pipe(
      debounceTime(300),          // user type karna stop kare 300ms ke baad hi call hogi
      distinctUntilChanged(),     // same text pe bar bar call nahi hogi
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.fetchProducts(searchTerm);
    });

  
  }

  getCategory() {
    this.httpsService.getCategory().subscribe(
      (res: any) => {
        if (res.status && res.data) {
          this.category = res.data;

          // Set the first category as active by default
    if (this.category.length > 0) {
  this.activeCategoryId = this.category[0]._id;
  if (this.activeCategoryId) { // ✅ null check
    this.getSubCategory(this.activeCategoryId);
  }
}
        } else {
          this.category = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }

  // Fetch subcategories for a category
getSubCategory(categoryId: string) {
  if (!categoryId) return; // ✅ Prevent invalid calls
  if (this.subCategories[categoryId]) return; // already loaded

  this.httpsService.getSubCategoryByCategoryId(categoryId).subscribe(
    (res: any) => {
      if (res.status && res.data) {
        this.subCategories[categoryId] = res.data;
      } else {
        this.subCategories[categoryId] = [];
      }
    },
    (error) => {
      console.error(`Error fetching Subcategories for ${categoryId}:`, error);
      this.subCategories[categoryId] = [];
    }
  );
}

  // On hover
  setActiveCategory(categoryId: string) {
    this.activeCategoryId = categoryId;
    this.getSubCategory(categoryId);
  }


onSearch() {
  if (!this.searchText.trim()) {
    this.products = [];
    this.searched = false;
    return;
  }

  this.httpsService.search(this.searchText).subscribe({
    next: (res: any) => {
      if (res.status && res.data) {
        this.products = res.data;
      } else {
        this.products = [];
      }
      this.searched = true;
    },
    error: () => {
      this.products = [];
      this.searched = true;
    }
  });
}

  onSearchClick() {
    const query = this.searchText.trim();
    if (query) {
      this.router.navigate(['/all-products'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/all-products']);
    }
  }


    onSearchChange(value: string) {
    this.searchText = value;
    this.searchSubject.next(value);
  }

  fetchProducts(query: string) {
    if (!query.trim()) {
      this.products = [];
      this.searched = false;
      return;
    }

    this.httpsService.search(query).subscribe({
      next: (res: any) => {
        this.products = (res.status && res.data) ? res.data : [];
        this.searched = true;
      },
      error: () => {
        this.products = [];
        this.searched = true;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

//   closeDropdown() {
//   this.products = [];
//   this.searched = false;
// }

closeDropdown() {
  this.products = [];
  this.searched = false;
  this.searchText = ''; // clear text
}



openMenuDropdown() {
  this.isMenuDropdownOpen = true;
}

closeMenuDropdown() {
  this.isMenuDropdownOpen = false;
}

  openIndex: number | null = null;
toggle(i: number, categoryId: string) {
  // toggle open index
  this.openIndex = this.openIndex === i ? null : i;

  // agar open ho raha hai to subcategories load karo
  if (this.openIndex === i) {
    this.getSubCategory(categoryId);
  }
}
isOpen(i: number) { return this.openIndex === i; }


navigateToProduct(productId: string) {
  this.router.navigate(['/product-details', productId]).then(() => {
    this.closeDropdown();
  });
}
}