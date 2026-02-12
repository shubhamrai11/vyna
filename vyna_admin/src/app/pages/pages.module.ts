import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashbordComponent } from './dashbord/dashbord.component';

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
import { ProjectDetailsComponent } from './project-details/project-details.component';

import { ContractManagementComponent } from './contract-management/contract-management.component';


import { TranslateModule } from '@ngx-translate/core';

import { ContactUsComponent } from './contact-us/contact-us.component';
import { ContactUsAddComponent } from './contact-us-add/contact-us-add.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { FAQComponent } from './faq/faq.component';
import { FAQADDComponent } from './faq-add/faq-add.component';
import { BannerComponent } from './banner/banner.component';
import { BannerAddComponent } from './banner-add/banner-add.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { SubcategoryAddComponent } from './subcategory-add/subcategory-add.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategoryComponent } from './category/category.component';
import { VisionComponent } from './vision/vision.component';
import { VisionAddComponent } from './vision-add/vision-add.component';
import { AwardComponent } from './award/award.component';
import { AwardAddComponent } from './award-add/award-add.component';
import { PromiseComponent } from './promise/promise.component';
import { PromiseAddComponent } from './promise-add/promise-add.component';
import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { AboutComponent } from './about/about.component';
import { AboutAddComponent } from './about-add/about-add.component';
import { FilterPipe } from './filter.pipe';
import { InqueryComponent } from './inquery/inquery.component';
import { InqueryViewComponent } from './inquery-view/inquery-view.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { ContentManagementAddComponent } from './content-management-add/content-management-add.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { CategoryViewComponent } from './category-view/category-view.component';
import { ContactUsFormComponent } from './contact-us-form/contact-us-form.component';
import { ContactUsFormViewComponent } from './contact-us-form-view/contact-us-form-view.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { SubcategoryViewComponent } from './subcategory-view/subcategory-view.component';
import { CmsBannerComponent } from './cms-banner/cms-banner.component';
import { CmsBannerAddComponent } from './cms-banner-add/cms-banner-add.component';
import { WhoWeAreComponent } from './who-we-are/who-we-are.component';
import { WhoWeAreAddComponent } from './who-we-are-add/who-we-are-add.component';
import { SustanbilityComponent } from './sustanbility/sustanbility.component';
import { SustanbilityAddComponent } from './sustanbility-add/sustanbility-add.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    SidebarComponent,
    DashbordComponent,
    FilterPipe,
    CapitalizePipe,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProjectDetailsComponent,
    
    ContractManagementComponent,
    
    ContactUsComponent,
    ContactUsAddComponent,
    NewsletterComponent,
    FAQComponent,
    FAQADDComponent,
    BannerComponent,
    BannerAddComponent,
    SubcategoryComponent,
    SubcategoryAddComponent,
    CategoryAddComponent,
    CategoryComponent,
    VisionComponent,
    VisionAddComponent,
    AwardComponent,
    AwardAddComponent,
    PromiseComponent,
    PromiseAddComponent,
    ProductComponent,
    ProductAddComponent,
    AboutComponent,
    AboutAddComponent,
    InqueryComponent,
    InqueryViewComponent,
    ContentManagementComponent,
    ContentManagementAddComponent,
    AdminProfileComponent,
    CategoryViewComponent,
    ContactUsFormComponent,
    ContactUsFormViewComponent,
    ProductViewComponent,
    SubcategoryViewComponent,
    CmsBannerComponent,
    CmsBannerAddComponent,
    WhoWeAreComponent,
    WhoWeAreAddComponent,
    SustanbilityComponent,
    SustanbilityAddComponent,
    ChangePasswordComponent,
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
