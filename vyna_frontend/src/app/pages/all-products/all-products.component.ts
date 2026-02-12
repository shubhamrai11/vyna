import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
declare var Swiper: any;

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
    category: any[] = [];
        products: any[] = [];
currentPage = 1;
totalPages = 1;
limit = 12;
banner: any = null;
sortOption: string = 'Popularity';
  allProducts: any[] = [];  

  constructor(private httpsService: HttpService) {}

  ngOnInit(): void {
    this.getCategory();
    this.fetchProducts(this.currentPage);
    this.getCMSBanner();
  }


    getCategory() {
    this.httpsService.getCategory().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.category = res.data;
                  setTimeout(() => this.initSwiper(), 100);
        } else {
          this.category = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }


fetchProducts(page: number) {
  this.httpsService.getProducts(1, 1000).subscribe((response: any) => {
    if (response.status === 'success') {
      let filtered = response.data.filter((p: any) => !p.highlightProduct);

      // Custom category order
      const categoryOrder: any = {
        'Lighting': 1,
        'Switchgear': 2,
        'Modular Switches': 3
      };

      // Sort products by custom order
      filtered.sort((a: any, b: any) => {
        const orderA = categoryOrder[a.categoryId.category_name] || 99;
        const orderB = categoryOrder[b.categoryId.category_name] || 99;
        return orderA - orderB;
      });

      this.totalPages = Math.ceil(filtered.length / this.limit);
      this.currentPage = page;

      const start = (page - 1) * this.limit;
      const end = start + this.limit;

      this.products = filtered.slice(start, end);
    }
  });
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.fetchProducts(page);
  }
}

  updateDisplayedProducts() {
    const start = (this.currentPage - 1) * this.limit;
    const end = start + this.limit;
    this.products = this.allProducts.slice(start, end);
  }

  getCMSBanner() {
    this.httpsService.cmsBanner().subscribe(
      (res: any) => {
        console.log('API Response:', res);

        if (res.status === 'success' && Array.isArray(res.data)) {
          this.banner = res.data.find((item: any) =>
            item.role?.toLowerCase() === 'Product'
          ) || null;

                    setTimeout(() => {
            new Swiper('.tf-sw-slideshow', {
              loop: true,
              autoplay: {
                delay: 3000,
              },
              pagination: {
                el: '.sw-pagination-slider',
                clickable: true,
              },
              navigation: {
                nextEl: '.navigation-next-slider',
                prevEl: '.navigation-prev-slider',
              },
              effect: 'fade',
              fadeEffect: {
                crossFade: true,
              },
            });
          }, 0);
        } else {
          this.banner = null;
        }
      },
      (error) => {
        console.error('Error :', error);
        this.banner = null;
      }
    );
  }


    initSwiper() {
  if (this.category.length === 0) return;

  // Agar pehle se swiper initialize ho chuka h to dobara destroy kardo
  const existing = document.querySelector('.tf-sw-categories') as any;
  if (existing && existing.swiper) {
    existing.swiper.destroy(true, true);
  }

  // ✅ Naya swiper initialize karo
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
    1200: { slidesPerView: 6, spaceBetween: 30 },
  },
});

}




  onSortChange(option: string) {
  this.sortOption = option;

  switch (option) {
    case 'Latest':
      // latest => createdAt ke hisaab se sort (desc)
      this.products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;

    case 'a-z':
      // Alphabetically A–Z
      this.products.sort((a, b) => a.productName.localeCompare(b.productName));
      break;

    case 'z-a':
      // Alphabetically Z–A
      this.products.sort((a, b) => b.productName.localeCompare(a.productName));
      break;

    default:
      // Popularity ya koi default sorting (yaha main API se jo order aya hai wohi rakha)
      break;
  }
}

}
