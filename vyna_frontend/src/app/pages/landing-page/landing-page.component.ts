import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
declare var Swiper: any;

declare var Splide: any;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  @ViewChildren('fadeLine') fadeLines!: QueryList<ElementRef>;
  aboutUs: any = null;
  banner: any[] = [];
  category: any[] = [];
  subCategory: any[] = [];
  promises: any[] = [];
  product: any[] = [];
  award: any[] = [];
  Math = Math;
  imageList: any[] = [];
  vision: any[] = [];
  descriptionLines: string[] = [];
  swiperInstance: any;
  constructor(private httpsService: HttpService) {}

  // gAfterViewInit(): void {
  //   setTimeout(() => {
  //     new Splide('#js-splide', {
  //       type: 'loop',
  //       perPage: 3,
  //       autoplay: true,
  //       gap: '1rem',
  //       breakpoints: {
  //         768: {
  //           perPage: 1,
  //         },
  //         1024: {
  //           perPage: 2,
  //         }
  //       }
  //     }).mount();
  //   }, 500); // Wait for DOM to render *ngFor
  // }

  ngOnInit(): void {
    this.getAboutUs();
    this.getBanner();
    this.getCategory();
    this.getSubCategory();
    this.getPromises();
    this.getProducts();
    this.getAward();
    this.getVision();
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });
      },
      { threshold: 0.6 }
    );

    setTimeout(() => {
      this.fadeLines.forEach((line) => {
        observer.observe(line.nativeElement);
      });
    }, 1); // slight delay to ensure DOM ready
  }
  getAboutUs() {
    this.httpsService.getHomeAbout().subscribe(
      (res: any) => {
        console.log('API Response:', res);

        if (res.status === 'success' && res.data?.length > 0) {
          this.aboutUs = res.data[0];
          this.imageList = this.aboutUs.image || [];
          this.formatDescriptionLines(this.aboutUs.description);

       
          setTimeout(() => {
            const splideEl = document.querySelector('#js-splide');

        
            if (splideEl && this.imageList.length > 0) {
              if ((splideEl as any)?.splide) {
                (splideEl as any).splide.destroy();
              }
              setTimeout(() => {
                new Splide('#js-splide', {
                  perPage: 1.5,
                  perMove: 1,
                  arrows: true,
                  focus: 'center',
                  padding: 0,
                  height: '500px',
                  cover: true,
                  type: 'loop',
                  gap: '0px',
                  autoplay: true,
                  breakpoints: {
                    800: {
                      perPage: 1.5,
                      gap: '0px',
                    focus: 'center',
                    },
                    600: {
                      perPage: 1,
                       gap: '0px',
                        focus: 'center',
                    },
                  },
                }).mount();
              }, 100);
            } else {
              console.warn('Splide element not found or imageList is empty.');
            }
          }, 100);
        } else {
          this.aboutUs = null;
          this.imageList = [];
        }
      },
      (error) => {
        console.error('Error fetching About Us:', error);
        this.aboutUs = null;
        this.imageList = [];
      }
    );
  }

  getBanner() {
    this.httpsService.getBanner().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.banner = res.data;
          setTimeout(() => {
            this.swiperInstance = new Swiper('.tf-sw-slideshow', {
              loop: true,
            preloadImages: false,
            lazy: true,          
            watchSlidesProgress: true,
              autoplay: {
                delay: 5000,
                disableOnInteraction: true,
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
              on: {
                init: () => {
                  setTimeout(() => {
                    const bullets = document.querySelectorAll(
                      '.sw-pagination-slider .swiper-pagination-bullet'
                    );
                    bullets.forEach((bullet) => {
                      bullet.addEventListener('click', () => this.stopAutoplay());
                    });
                    const nextBtn = document.querySelector(
                      '.navigation-next-slider'
                    );
                    const prevBtn = document.querySelector(
                      '.navigation-prev-slider'
                    );
                    [nextBtn, prevBtn].forEach((btn) => {
                      if (btn) {
                        (btn as HTMLElement).addEventListener('click', () =>
                          this.stopAutoplay()
                        );
                      }
                    });
                  }, 500);
                },
              },
            });
          }, 0);
        } else {
          this.banner = [];
        }
      },
      (error) => {
        console.error('Error fetching Banners:', error);
      }
    );
  }

  stopAutoplay() {
    if (this.swiperInstance && this.swiperInstance.autoplay) {
      this.swiperInstance.autoplay.stop();
    }
  }

  onBannerHover() {
    this.stopAutoplay();
  }

  onBannerLeave() {
    if (this.swiperInstance && this.swiperInstance.autoplay) {
      this.swiperInstance.autoplay.start();
    }
  }

  isVideo(url: string): boolean {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  }

  getCategory() {
    this.httpsService.getCategory().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.category = res.data;
        } else {
          this.category = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }

  getSubCategory() {
    this.httpsService.getSubCategory().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.subCategory = res.data;
        } else {
          this.subCategory = [];
        }
      },
      (error) => {
        console.error('Error fetching Sub Categories:', error);
      }
    );
  }

  formatDescription(text: string): string {
    return text ? text.replace(/\n/g, '<br>') : '';
  }

  getPromises() {
    this.httpsService.getPromises().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.promises = res.data;
        } else {
          this.promises = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }

  getAward() {
    this.httpsService.getAward().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.award = res.data;
          setTimeout(() => {
            const awardContainer = document.querySelector('.tf-sw-slideshow-award');
            if (!awardContainer) return;
            new Swiper(awardContainer as any, {
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
          this.award = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }

  getProducts() {
    this.httpsService.getFeatureProduct().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.product = res.data;
        } else {
          this.product = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }

  getVision() {
    this.httpsService.getVision().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.vision = res.data;
        } else {
          this.vision = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/fallback.jpg'; // Show backup image if broken
  }

  get productChunks() {
    const chunkSize = 2;
    const result = [];
    for (let i = 0; i < this.product.length; i += chunkSize) {
      result.push(this.product.slice(i, i + chunkSize));
    }
    return result;
  }

  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.classList.add('fade-in-image-loaded');
  }

  formatDescriptionLines(desc: string) {
    this.descriptionLines = desc
      .split(/\r?\n|\r/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  getClipClass(index: number): string {
    const classes = [
      'clip-text_one',
      'clip-text_two',
      'clip-text_tree',
      'clip-text_four',
      'clip-text_five',
    ];
    return classes[index] || 'clip-text_one'; // fallback
  }

  removeBlur(event: any) {
  event.target.classList.remove('blur');
}
}
