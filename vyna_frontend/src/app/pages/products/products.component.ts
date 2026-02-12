import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
declare var Swiper: any;



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

categoryId!: string;
  subCategoryId!: string;
categoryDetails: any = {};
    subCategories: any[] = [];
limit = 2;
// totalPages = 0;
displayedProducts: any[] = [];
isLoading = true;


page: number = 1; 
itemsPerPage: number = 8;
totalPages: number = 1;  
products: any[] = [];       
paginatedProducts: any[] = [];

  currentPage = 1;



  constructor(
    private route: ActivatedRoute,
    private httpsService: HttpService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.categoryId = params.get('categoryId') || '';
      console.log('Category ID from query:', this.categoryId);

      if (this.categoryId) {
        this.getProductsByCategoryId(this.categoryId);
        this.fetchProductDetails(this.categoryId)
                this.getSubCategory(this.categoryId);

      }
    });

      this.totalPages = Math.ceil(this.products.length / this.limit);

        setTimeout(() => this.initSwiper(), 300);
  }


  initSwiper() {
  if (this.subCategories.length === 0) return;
  const existing = document.querySelector('.tf-sw-categories') as any;
  if (existing && existing.swiper) {
    existing.swiper.destroy(true, true);
  }

new Swiper('.tf-sw-categories', {
  slidesPerView: 9,
  spaceBetween: 30,
  navigation: {
    nextEl: '.nav-next-categories',
    prevEl: '.nav-prev-categories',
  },
  pagination: {
    el: '.sw-pagination-categories',
    clickable: true,
  },
  breakpoints: {
    320: { slidesPerView: 3, spaceBetween: 20 },
    576: { slidesPerView: 3, spaceBetween: 20 },
    768: { slidesPerView: 4, spaceBetween: 20 },
    992: { slidesPerView: 6, spaceBetween: 20 },
    1200: { slidesPerView: 9, spaceBetween: 30 },
  },
});

}

getSubCategory(categoryId: string) {
  if (!categoryId) return;

  this.httpsService.getSubCategoryByCategoryId(categoryId).subscribe(
    (res: any) => {
      if (res.status && res.data) {
        this.subCategories = res.data;

   setTimeout(() => {
  this.cdref.detectChanges();
  this.initSwiper();
}, 0);
      } else {
        this.subCategories = [];
      }
    },
    (error) => {
      console.error(`Error fetching Subcategories for ${categoryId}:`, error);
      this.subCategories = [];
    }
  );
}

getProductsByCategoryId(categoryId: string) {
  this.isLoading = true;
  this.httpsService.getProductsByCategoryId(categoryId).subscribe(
    (res: any) => {
      if (res.status && res.data) {
        this.products = res.data.filter((p: any) => !p.highlightProduct);

        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);

        this.updateDisplayedProducts();
      } else {
        this.products = [];
        this.paginatedProducts = [];
      }
       this.isLoading = false; 
    },
    (error) => {
      console.error(`Error fetching products for ${categoryId}:`, error);
      this.products = [];
      this.paginatedProducts = [];
       this.isLoading = false; 
    }
  );
}

onPageChange(newPage: number) {
  if (newPage < 1 || newPage > this.totalPages) return; // Out of range mat jao
  this.page = newPage;
  this.updateDisplayedProducts();
}

updateDisplayedProducts() {
  const start = (this.page - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedProducts = this.products.slice(start, end);
}


setPaginatedData() {
  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;
  this.displayedProducts = this.products.slice(start, end);
}

  fetchProductDetails(categoryId: string): void {
  this.httpsService.getCategoryById(categoryId).subscribe(
    (res: any) => {
      if (res.status) {
        this.categoryDetails = res.data;

      }
    },
    (err) => {
      console.error('Error fetching product details:', err);
    }
  );
}
}

