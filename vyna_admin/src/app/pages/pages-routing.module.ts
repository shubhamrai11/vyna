import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { PagesComponent } from './pages.component';

import { ContractManagementComponent } from './contract-management/contract-management.component';


// AGENCE MANAGEMENT

import { ContactUsComponent } from './contact-us/contact-us.component';
import { ContactUsAddComponent } from './contact-us-add/contact-us-add.component';
import { HomeComponent } from './home/home.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { FAQComponent } from './faq/faq.component';
import { FAQADDComponent } from './faq-add/faq-add.component';
import { BannerComponent } from './banner/banner.component';
import { BannerAddComponent } from './banner-add/banner-add.component';
import { CategoryComponent } from './category/category.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { SubcategoryAddComponent } from './subcategory-add/subcategory-add.component';
import { VisionComponent } from './vision/vision.component';
import { VisionAddComponent } from './vision-add/vision-add.component';
import { AwardComponent } from './award/award.component';
import { AwardAddComponent } from './award-add/award-add.component';
import { PromiseComponent } from './promise/promise.component';
import { PromiseAddComponent } from './promise-add/promise-add.component';
import { AboutComponent } from './about/about.component';
import { AboutAddComponent } from './about-add/about-add.component';
import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { ContentManagementAddComponent } from './content-management-add/content-management-add.component';
import { InqueryComponent } from './inquery/inquery.component';
import { InqueryViewComponent } from './inquery-view/inquery-view.component';
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


const routes: Routes = [
  {
    path: '',
    component: PagesComponent, // Set PagesComponent as the parent layout
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashbordComponent },
      { path: 'project-details/:id', component: ProjectDetailsComponent },

      { path: 'contract-management', component: ContractManagementComponent },


      { path: 'contact', component: ContactUsComponent },
      { path: 'newsletter', component: NewsletterComponent },
      { path: 'contact-add', component: ContactUsAddComponent },
      { path: 'contact-add/edit/:id', component: ContactUsAddComponent },
      { path: 'faq', component: FAQComponent },
      { path: 'faq-add', component: FAQADDComponent },
      { path: 'faq-add/edit/:id', component: FAQADDComponent },
      { path: 'banner', component: BannerComponent },
      { path: 'banner-add', component: BannerAddComponent },
      { path: 'banner-add/edit/:id', component: BannerAddComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'category-add', component: CategoryAddComponent },
      { path: 'category-add/edit/:id', component: CategoryAddComponent },
      { path: 'subcategory', component: SubcategoryComponent },
      { path: 'subcategory-add', component: SubcategoryAddComponent },
      { path: 'subcategory-add/edit/:id', component: SubcategoryAddComponent },
      { path: 'vision', component: VisionComponent },
      { path: 'vision-add', component: VisionAddComponent },
      { path: 'vision-add/edit/:id', component: VisionAddComponent },
      { path: 'award', component: AwardComponent },
      { path: 'award-add', component: AwardAddComponent },
      { path: 'award-add/edit/:id', component: AwardAddComponent },
      { path: 'promise', component: PromiseComponent },
      { path: 'promise-add', component: PromiseAddComponent },
      { path: 'promise-add/edit/:id', component: PromiseAddComponent },
      { path: 'about', component: AboutComponent },
      { path: 'about-add', component: AboutAddComponent },
      { path: 'about-add/edit/:id', component: AboutAddComponent },
      { path: 'product', component: ProductComponent },
      { path: 'product-add', component: ProductAddComponent },
      { path: 'product-add/edit/:id', component: ProductAddComponent },
      { path: 'content', component: ContentManagementComponent },
      { path: 'content-add', component: ContentManagementAddComponent },
      { path: 'content-add/edit/:id', component: ContentManagementAddComponent },
      { path: 'inquery', component: InqueryComponent },
      { path: 'inquery-view/:id', component: InqueryViewComponent },
      { path: 'admin-profile', component: AdminProfileComponent },
      { path: 'category-view/:id', component: CategoryViewComponent },
      { path: 'contact-us-form', component: ContactUsFormComponent },
      { path: 'contact-us-view/:id', component: ContactUsFormViewComponent },
      { path: 'product-view/:id', component: ProductViewComponent },
      { path: 'subcategory-view/:id', component: SubcategoryViewComponent },
      { path: 'cms-banner', component: CmsBannerComponent },
      { path: 'cms-banner-add', component: CmsBannerAddComponent },
      { path: 'cms-banner-add/edit/:id', component: CmsBannerAddComponent },
      { path: 'who-we-are', component: WhoWeAreComponent },
      { path: 'who-we-are-add', component: WhoWeAreAddComponent },
      { path: 'who-we-are-add/edit/:id', component: WhoWeAreAddComponent },
      { path: 'sustanbility', component: SustanbilityComponent },
      { path: 'sustanbility-add', component: SustanbilityAddComponent },
      { path: 'sustanbility-add/edit/:id', component: SustanbilityAddComponent },
      { path: 'change-password', component: ChangePasswordComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
