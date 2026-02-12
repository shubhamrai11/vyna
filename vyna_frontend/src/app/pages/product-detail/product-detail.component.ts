import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/services/http.service';
import namer from 'color-namer'
import html2pdf from 'html2pdf.js';
 
 
declare var Swiper: any;
 
 
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
 
 
 
export class ProductDetailComponent implements OnInit {
  @ViewChild('mainImage') mainImage!: ElementRef;
@ViewChild('imageContainer') imageContainer!: ElementRef;
@ViewChildren('mainImage') mainImages!: QueryList<ElementRef>;
@ViewChildren('imageContainer') imageContainers!: QueryList<ElementRef>;
selectedImage:any;
productId!: string;
  productDetails: any = null;
  relatedProducts: any[] = [];
selectedImageIndex: number = 0;
isLoadingBrochure = false; 
 
  showLens = false;
lensStyle: any = {};
zoomPreviewStyle: any = {};
 
 
  constructor(private route: ActivatedRoute, private http: HttpClient, private httpsService: HttpService) {}
 
 
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      if (this.productId) {
        this.fetchProductDetails(this.productId);
        this.fetchBrochure(this.productId)
      }
    });
  }
 
 ngAfterViewInit(): void {
    document.querySelectorAll('.stagger-item img').forEach(img => {
      img.addEventListener('load', () => {
        img.parentElement?.classList.add('stagger-finished');
      });
    });
 
        if (this.relatedProducts.length) {
      this.initSwiper();
    }
  }
 
fetchProductDetails(id: string): void {
  this.httpsService.getProductById(id).subscribe(
    (res: any) => {
      if (res.status) {
        this.productDetails = res.data;
 
                const categoryId = this.productDetails?.categoryId?._id || this.productDetails?.categoryId;
        if (categoryId) {
          this.getProductsByCategoryId(categoryId);
        }
 
        // Wait for DOM to render
        setTimeout(() => {
          const thumbsSwiper = new Swiper('.tf-product-media-thumbs', {
            spaceBetween: 10,
            slidesPerView: 4,
            watchSlidesProgress: true,
          });
 
          new Swiper('.tf-product-media-main', {
            spaceBetween: 10,
            loop: true,
            navigation: {
              nextEl: '.navigation-next-slider',
              prevEl: '.navigation-prev-slider',
            },
            thumbs: {
              swiper: thumbsSwiper,
            },
          });
        }, 0);
      }
    },
    (err) => {
      console.error('Error fetching product details:', err);
    }
  );
}
 
getProductsByCategoryId(categoryId: string) {
  console.log("Fetching products for category:", categoryId); // ✅ Debug
  this.httpsService.getProductsByCategoryId(categoryId).subscribe(
    (res: any) => {
      console.log("Related products API response:", res); // ✅ Debug
      if (res.status && res.data) {
            this.relatedProducts = res.data.filter(
          (p: any) => !p.highlightProduct && p._id !== this.productId
        )
            .slice(0, 7);
setTimeout(() => {
  new Swiper('.tf-sw-latest', {
    slidesPerView: 4,
    spaceBetween: 30,
    slidesPerGroup: 4,   // ✅ Ek group me 4 slides
    navigation: {
      nextEl: '.nav-next-categories',
      prevEl: '.nav-prev-categories',
    },
    pagination: {
      el: '.sw-pagination-latest',
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 5 },
      576: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
      768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
      992: { slidesPerView: 6, slidesPerGroup: 6, spaceBetween: 20 },
      1200: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: 30 },
    },
  });
}, 0);


      } else {
        this.relatedProducts = [];
      }
    },
    (error) => {
      console.error(`Error fetching products for ${categoryId}:`, error);
      this.relatedProducts = [];
    }
  );
}
 
 
 
  initSwiper() {
    new Swiper('.tf-sw-latest', {
      slidesPerView: 4,
      spaceBetween: 30,
      pagination: {
        el: '.sw-pagination-latest',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 4 },
        480: { slidesPerView: 2 }
      }
    });
  }
getColorName(code: string): string {
  try {
   // console.log('====code=============',code)
    const result = namer(code);
    return result.ntc[0].name;
  } catch {
    return code;
  }
}
 
fetchBrochure(productId: string): void {
  this.httpsService.getBrochure(productId).subscribe(
    (res: any) => {
      if (res.status && res.data?.brochureUrl) {
        // PDF URL
        const pdfUrl = res.data.brochureUrl;
 
        // PDF ko new tab me open karo
        window.open(pdfUrl, '_blank');
      } else {
        console.warn('Brochure not found for this product');
      }
    },
    (err) => {
      console.error('Error fetching brochure:', err);
    }
  );
}

openBrochure(productId: string): void {
   this.isLoadingBrochure = true;
this.httpsService.getProductHtml(productId).subscribe((res: any) => {
    if (res.status && res.html) {
      const htmlContent = res.html;

      const tempElement = document.createElement('div');
      tempElement.innerHTML = htmlContent;
      document.body.appendChild(tempElement);
      

      const imgs = tempElement.querySelectorAll('img');
      imgs.forEach((img: any) => {
        if (img.src && img.src.startsWith('/')) {
          // Convert relative to absolute
          img.src = window.location.origin + img.src;
        }
      });
      const options: any = {
        margin: 0.3,
        filename: `product-${productId}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // 🧾 4️⃣ Generate PDF
      html2pdf()
        .set(options)
        .from(tempElement)
        .save()
        .then(() => {
          document.body.removeChild(tempElement);
           this.isLoadingBrochure = false;
        })
        .catch((err: any) => {
          console.error('PDF generation error:', err);
          document.body.removeChild(tempElement);
             this.isLoadingBrochure = false;
        });
    } else {
      console.error('Invalid backend response:', res);
       this.isLoadingBrochure = false; 
    }
  });
}

onThumbnailClick(img: any, index: number) {
  this.selectedImage = img;
  this.selectedImageIndex = index;
}
 

onMouseMove(event: MouseEvent, index: number) {
  const imageEl = this.mainImages.toArray()[index].nativeElement as HTMLImageElement;
  const rect = imageEl.getBoundingClientRect();
 
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
 
  const lensWidth = 200;
  const lensHeight = 200;
 
  let lensX = x - lensWidth / 2;
  let lensY = y - lensHeight / 2;
 
  if (lensX < 0) lensX = 0;
  if (lensY < 0) lensY = 0;
  if (lensX > rect.width - lensWidth) lensX = rect.width - lensWidth;
  if (lensY > rect.height - lensHeight) lensY = rect.height - lensHeight;
 
  this.lensStyle = {
    left: lensX + 'px',
    top: lensY + 'px',
    width: lensWidth + 'px',
    height: lensHeight + 'px'
  };
 
  let zoomFactor = 2; // base zoom factor
  const maxZoom = 1200; // px limit (aap change kar sakte ho)
  const imageUrl = this.selectedImage?.url || imageEl.src;
 
  // background size calculate karo but cap it with maxZoom
  let bgWidth = Math.min(imageEl.naturalWidth * zoomFactor, maxZoom);
  let bgHeight = Math.min(imageEl.naturalHeight * zoomFactor, maxZoom);
 
  this.zoomPreviewStyle = {
    'background-image': `url('${imageUrl}')`,
    'background-size': `${bgWidth}px ${bgHeight}px`,
    'background-position': `-${lensX * (bgWidth / rect.width)}px -${lensY * (bgHeight / rect.height)}px`
  };
 
  console.log('================<<>_zoomPreviewStyle-----', this.zoomPreviewStyle);
  this.showLens = true;
}
onMouseLeave() {
  this.showLens = false;
}

hasValue(field: string): boolean {
  return this.productDetails?.specification?.some(
    (spec: any) => spec && spec[field]
  );
}

isCommon(field: string): boolean {
  if (!this.productDetails?.specification?.length) return false;

  const values = this.productDetails.specification
    .map((s: any) => s[field])
    .filter((v: any) => v !== null && v !== undefined);

  return new Set(values).size === 1;
}


getCommonValue(field: string): any {
  return this.productDetails?.specification?.[0]?.[field] || '-';
}



 
}