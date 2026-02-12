import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatTabsModule } from '@angular/material/tabs';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { CapitalizePipe } from '../shared/capitalize.pipe';

import { DatePipe } from '@angular/common';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { MatDatepickerModule } from '@angular/material/datepicker';


import { MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { HomeComponent } from './home/home.component';

import { AddWellComponent } from './add-well/add-well.component';


import { TranslateModule } from '@ngx-translate/core';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DealersComponent } from './dealers/dealers.component';
import { FaqComponent } from './faq/faq.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { CareerComponent } from './career/career.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { SubcategoryProductsComponent } from './subcategory-products/subcategory-products.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { ECatalogueComponent } from './e-catalogue/e-catalogue.component';
import { PrComponent } from './pr/pr.component';
// AGENCE MANAGEMENT

@NgModule({
  declarations: [
    SidebarComponent,
    CapitalizePipe,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AddWellComponent,
         LandingPageComponent,
         AboutUsComponent,
         ContactUsComponent,
         DealersComponent,
         FaqComponent,
         ProductsComponent,
         ProductDetailComponent,
         PrivacyPolicyComponent,
         TermsAndConditionsComponent,
         CareerComponent,
         AllProductsComponent,
         SubcategoryProductsComponent,
         CatalogueComponent,
         ECatalogueComponent,
         PrComponent,
  ],
  exports: [SidebarComponent,FooterComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AngularEditorModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    TranslateModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    HttpClientModule,
    RouterModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatTabsModule,
    GooglePlaceModule,
  

  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
