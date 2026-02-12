import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DealersComponent } from './dealers/dealers.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsComponent } from './products/products.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { CareerComponent } from './career/career.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { SubcategoryProductsComponent } from './subcategory-products/subcategory-products.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { ECatalogueComponent } from './e-catalogue/e-catalogue.component';
import { PrComponent } from './pr/pr.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, //  root path calls HomeComponent
    children: [
      {
        path: '',
        component: LandingPageComponent,
      },
      {
        path: 'faq',
        component: FaqComponent,
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
      },
      {
        path: 'dealers',
        component: DealersComponent,
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
      },
      {
        path: 'product-details/:id',
        component: ProductDetailComponent,
      },
      {
        path: 'products/:id',
        component: ProductsComponent,
      },
            {
        path: 'subcategory-product/:id',
        component: SubcategoryProductsComponent,
      },
      {
        path: 'terms-conditions',
        component: TermsAndConditionsComponent,
      },
      {
        path: 'career',
        component: CareerComponent,
      },
      {
        path: 'all-products',
        component: AllProductsComponent,
      },
      {
        path: 'catalogue',
        component: CatalogueComponent,
      },
      {
        path: 'e-catalogue',
        component: ECatalogueComponent,
      },
      {
        path: 'pr',
        component: PrComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
