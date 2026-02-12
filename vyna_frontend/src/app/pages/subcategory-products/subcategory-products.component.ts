import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
declare var Swiper: any;


@Component({
  selector: 'app-subcategory-products',
  templateUrl: './subcategory-products.component.html',
  styleUrls: ['./subcategory-products.component.css']
})
export class SubcategoryProductsComponent implements OnInit {

categoryId!: string;
  subcategoryId!: string;
  // products: any[] = [];
    subCategories: any[] = [];
// paginatedProducts: any[] = [];
// page = 1;
limit = 2; // items per page
// totalPages = 0;
displayedProducts: any[] = [];
subCategoryDetails: any = {};
isLoading = true;

  currentPage = 1;
  // itemsPerPage = 10; 


  page: number = 1;              // Current page
itemsPerPage: number = 8;      // Har page pe kitne products dikhane hain
totalPages: number = 1;        // Total pages
products: any[] = [];          // All products (API se)
paginatedProducts: any[] = []; // Current page ke products


  constructor(
    private route: ActivatedRoute,
    private httpsService: HttpService
  ) {}

  ngOnInit(): void {
    // ✅ Query Param se Category ID lena
    this.route.queryParamMap.subscribe(params => {
      this.subcategoryId = params.get('subcategoryId') || '';
      console.log('Category ID from query:', this.subcategoryId);

      if (this.subcategoryId) {
        this.getSubCategory(this.subcategoryId);
        this.getProductsBySubCategoryId(this.subcategoryId);
        this.fetchSubCategoryDetails(this.subcategoryId)
      }

      //     this.route.queryParamMap.subscribe(params => {
      // this.categoryId = params.get('categoryId') || '';
      // console.log('Category ID from query:', this.categoryId);

      // if (this.categoryId) {
      //   this.getS(this.categoryId);
      //   this.get(this.categoryId);
      // }


    });
      this.totalPages = Math.ceil(this.products.length / this.limit);

        setTimeout(() => this.initSwiper(), 300);
  }


  getSubCategory(categoryId: string) {
  if (!categoryId) return;

  this.httpsService.getSubCategoryByCategoryId(categoryId).subscribe(
    (res: any) => {
      if (res.status && res.data) {
        this.subCategories = res.data; // store array directly
        setTimeout(() => this.initSwiper(), 100);
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
    this.httpsService.getProductsByCategoryId(categoryId).subscribe(
    (res: any) => {
      if (res.status && res.data) {
        this.products = res.data;
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
this.updateDisplayedProducts();

      } else {
        this.products = [];
        this.paginatedProducts = [];
      }
    },
    (error) => {
      console.error(`Error fetching products for ${categoryId}:`, error);
      this.products = [];
      this.paginatedProducts = [];
    }
  );
  }

getProductsBySubCategoryId(subcategoryId: string) {
  this.isLoading = true;
  this.httpsService.getProductsBySubCategoryId(subcategoryId).subscribe(
    (res: any) => {
      if (res.status && res.data) {
        // ✅ Highlighted products ko hatao
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
      console.error(`Error fetching products for ${subcategoryId}:`, error);
      this.products = [];
      this.paginatedProducts = [];
             this.isLoading = false;
    }
  );
}

onPageChange(newPage: number) {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.page = newPage;
    this.setPaginatedData();
  }
}

setPaginatedData() {
  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;
  this.displayedProducts = this.products.slice(start, end);
}

updateDisplayedProducts() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.displayedProducts = this.products.slice(start, end);
}

  initSwiper() {
    new Swiper('.swiper tf-sw-categories swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden', {
      slidesPerView: 5,
      spaceBetween: 30,
      navigation: {
        nextEl: '.nav-next-categories',
        prevEl: '.nav-prev-categories',
      },
    });
  }


    fetchSubCategoryDetails(subcategoryId: string): void {
  this.httpsService.getSubCategoryById(subcategoryId).subscribe(
    (res: any) => {
      if (res.status) {
        this.subCategoryDetails = res.data;

      }
    },
    (err) => {
      console.error('Error fetching product details:', err);
    }
  );
}

}
