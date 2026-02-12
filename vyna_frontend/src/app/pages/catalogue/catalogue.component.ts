import { Component, OnInit } from '@angular/core';

interface CataloguePdf {
  name: string;
  description: string;
  downloadUrl: string;
  thumbnailIcon: string;
}

interface CatalogueSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  items: CataloguePdf[];
}

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css'],
})
export class CatalogueComponent implements OnInit {
  sections: CatalogueSection[] = [];
  activeSection: string = '';
  isLoading: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.loadCatalogues();
  }

  /**
   * Loads the catalogue sections and their PDF items.
   * Replace the downloadUrl values with actual Google Drive direct download links.
   * Format: https://drive.google.com/uc?export=download&id=FILE_ID
   */
  loadCatalogues(): void {
    this.sections = [
      {
        id: 'lighting',
        title: 'Lighting',
        subtitle: 'Explore our comprehensive range of lighting solutions',
        icon: 'lightbulb',
        items: [
          {
            name: 'LED Panel Lights Catalogue',
            description: 'Complete range of LED panel lights for commercial and residential use.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Downlighters Catalogue',
            description: 'Recessed and surface-mounted downlighters in various wattages.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Street & Flood Lights Catalogue',
            description: 'Heavy-duty outdoor lighting for streets, parks, and industrial areas.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Decorative Lighting Catalogue',
            description: 'Designer lighting fixtures for premium interiors and facades.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
        ],
      },
      {
        id: 'switchgear',
        title: 'Switchgear',
        subtitle: 'High-quality switchgear for safe and reliable power distribution',
        icon: 'electrical_services',
        items: [
          {
            name: 'MCB & RCCB Catalogue',
            description: 'Miniature circuit breakers and residual current circuit breakers.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Distribution Boards Catalogue',
            description: 'Single and three-phase distribution boards for all applications.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Changeover Switches Catalogue',
            description: 'Manual and automatic changeover switches for power backup.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
        ],
      },
      {
        id: 'wires-cables',
        title: 'Wires & Cables',
        subtitle: 'Premium quality wires and cables for every application',
        icon: 'cable',
        items: [
          {
            name: 'House Wiring Cables Catalogue',
            description: 'FR and FRLS house wiring cables in various sizes and colours.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Industrial Cables Catalogue',
            description: 'Armoured and unarmoured cables for industrial installations.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
        ],
      },
      {
        id: 'switches-sockets',
        title: 'Switches & Sockets',
        subtitle: 'Stylish and durable switches and sockets for modern spaces',
        icon: 'toggle_on',
        items: [
          {
            name: 'Modular Switches Catalogue',
            description: 'Contemporary modular switches with sleek designs and finishes.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Smart Switches Catalogue',
            description: 'IoT-enabled smart switches with app and voice control.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
        ],
      },
      {
        id: 'fans',
        title: 'Fans',
        subtitle: 'Energy-efficient fans designed for comfort and performance',
        icon: 'air',
        items: [
          {
            name: 'Ceiling Fans Catalogue',
            description: 'BLDC and conventional ceiling fans with modern aesthetics.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Exhaust Fans Catalogue',
            description: 'Ventilation and exhaust fans for kitchens, bathrooms, and industrial use.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
        ],
      },
      {
        id: 'conduit-accessories',
        title: 'Conduit & Accessories',
        subtitle: 'Complete conduit piping systems and electrical accessories',
        icon: 'plumbing',
        items: [
          {
            name: 'PVC Conduit Pipes Catalogue',
            description: 'Rigid and flexible PVC conduit pipes with fittings.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
          {
            name: 'Electrical Accessories Catalogue',
            description: 'Junction boxes, gang boxes, clamps, and more.',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID',
            thumbnailIcon: 'picture_as_pdf',
          },
        ],
      },
    ];

    this.isLoading = false;

    // Set the first section as active by default
    if (this.sections.length > 0) {
      this.activeSection = this.sections[0].id;
    }
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    const element = document.getElementById('section-' + sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  }

  downloadCatalogue(item: CataloguePdf): void {
    window.open(item.downloadUrl, '_blank');
  }

  getTotalCatalogues(): number {
    return this.sections.reduce((total, section) => total + section.items.length, 0);
  }
}
