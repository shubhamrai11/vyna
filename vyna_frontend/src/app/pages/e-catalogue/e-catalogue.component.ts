import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

interface SubCategoryItem {
  _id: string;
  subCategoryName: string;
  image: string;
  file: string;
  categoryId: any;
}

interface ECatalogueSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  categoryLogo: string;
  items: SubCategoryItem[];
}

@Component({
  selector: 'app-e-catalogue',
  templateUrl: './e-catalogue.component.html',
  styleUrls: ['./e-catalogue.component.css'],
})
export class ECatalogueComponent implements OnInit {
  sections: ECatalogueSection[] = [];
  activeSection: string = '';
  isLoading: boolean = true;
  fallbackPdfUrl: string =
    'https://drive.google.com/file/d/1-hx9fbFocMM2KnVoBYt9Gs0X1rYNxBje/view?usp=sharing';

  private categoryIconMap: { [key: string]: string } = {
    lighting: 'lightbulb',
    switchgear: 'electrical_services',
    'modular switches & wiring accessories': 'toggle_on',
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadECatalogues();
  }

  /**
   * Fetches categories from API, then for each category fetches its subcategories.
   * Builds the sections array dynamically.
   */
  loadECatalogues(): void {
    this.isLoading = true;
    this.httpService.getCategory().subscribe(
      (res: any) => {
        if (res?.status === 'success' && res?.data?.length) {
          const categories = res.data;
          let completedRequests = 0;
          const totalCategories = categories.length;

          categories.forEach((cat: any) => {
            const sectionId = this.toSectionId(cat.category_name);
            const section: ECatalogueSection = {
              id: sectionId,
              title: cat.category_name,
              description: this.stripHtml(cat.category_description || ''),
              icon: this.getCategoryIcon(cat.category_name),
              categoryLogo: cat.category_logo || cat.category_image || '',
              items: [],
            };

            // Push section immediately to preserve order
            this.sections.push(section);

            // Fetch subcategories for this category
            this.httpService.getSubCategoryByCategoryId(cat._id).subscribe(
              (subRes: any) => {
                if (subRes?.status === 'success' && subRes?.data?.length) {
                  section.items = subRes.data.map((sub: any) => ({
                    _id: sub._id,
                    subCategoryName: sub.subCategoryName,
                    image: sub.image || '',
                    file: sub.file || '',
                    categoryId: sub.categoryId,
                  }));
                }
                completedRequests++;
                if (completedRequests === totalCategories) {
                  this.onAllLoaded();
                }
              },
              () => {
                completedRequests++;
                if (completedRequests === totalCategories) {
                  this.onAllLoaded();
                }
              }
            );
          });
        } else {
          this.isLoading = false;
        }
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  private onAllLoaded(): void {
    this.isLoading = false;
    if (this.sections.length > 0) {
      this.activeSection = this.sections[0].id;
    }
  }

  /**
   * Returns the PDF URL for a subcategory item.
   * Uses the item's `file` property if available, otherwise falls back to default.
   */
  getPdfUrl(item: SubCategoryItem): string {
    return item.file || this.fallbackPdfUrl;
  }

  /**
   * Returns a direct download URL.
   * For Google Drive links, converts to direct download format.
   * For other URLs, returns as-is.
   */
  getDownloadUrl(item: SubCategoryItem): string {
    const url = this.getPdfUrl(item);
    // Convert Google Drive view links to direct download
    const driveMatch = url.match(/\/file\/d\/([^/]+)/);
    if (driveMatch) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    return url;
  }

  /**
   * Opens the PDF in a new browser tab for viewing.
   */
  viewPdf(item: SubCategoryItem, event: Event): void {
    event.stopPropagation();
    const url = this.getPdfUrl(item);
    window.open(url, '_blank');
  }

  /**
   * Downloads the PDF directly without opening in a new tab.
   * Uses an anchor element with download attribute for direct URLs,
   * and Google Drive direct download conversion for Drive links.
   */
  downloadPdf(item: SubCategoryItem, event: Event): void {
    event.stopPropagation();
    const url = this.getPdfUrl(item);
    const driveMatch = url.match(/\/file\/d\/([^/]+)/);

    if (driveMatch) {
      // For Google Drive files, use direct download URL
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For direct file URLs (e.g., S3), fetch and download as blob
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.setAttribute(
            'download',
            item.subCategoryName.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf'
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch(() => {
          // Fallback: open in new tab if download fails
          window.open(url, '_blank');
        });
    }
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    const element = document.getElementById('ecat-section-' + sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  }

  getTotalItems(): number {
    return this.sections.reduce(
      (total, section) => total + section.items.length,
      0
    );
  }

  private toSectionId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private getCategoryIcon(categoryName: string): string {
    const key = categoryName.toLowerCase();
    return this.categoryIconMap[key] || 'folder';
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}
