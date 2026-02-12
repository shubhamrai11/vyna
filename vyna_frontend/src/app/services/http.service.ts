import { Injectable } from '@angular/core';
import { constant } from '../../../src/constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(  private httpService: HttpClient,) { }

    getAboutUs() {
    return this.httpService.get(constant.aboutUs);
  }
      getHomeAbout() {
    return this.httpService.get(constant.homeAbout);
  }
        getSustainValues() {
    return this.httpService.get(constant.sustainValue);
  }




    getContent() {
    return this.httpService.get(constant.getContent);
  }
      getBanner() {
    return this.httpService.get(constant.banner);
  }

        getCategory() {
    return this.httpService.get(constant.category);
  }
          getSubCategory() {
    return this.httpService.get(constant.subCategory);
  }

            getContactUs() {
    return this.httpService.get(constant.contactUs);
  }
              getPromises() {
    return this.httpService.get(constant.ourPromises);
  }
                getProduct() {
    return this.httpService.get(constant.product);
  }
                  getFeatureProduct() {
    return this.httpService.get(constant.featureProduct);
  }


  getProducts(page: number, limit: number = 8) {
  const url = `${constant.product}?page=${page}&limit=${limit}`;
  return this.httpService.get(url);
}

                  getAward() {
    return this.httpService.get(constant.award);
  }

                    getVision() {
    return this.httpService.get(constant.vision);
  }
                      getfaq() {
    return this.httpService.get(constant.faq);
  }
            newsletter(data: any) {
    return this.httpService.post(constant.newsletter, data);
  }
              faqForm(data: any) {
    return this.httpService.post(constant.faqQues, data);
  }
              contactForm(data: any) {
    return this.httpService.post(constant.contactForm, data);
  }

                cmsBanner() {
    return this.httpService.get(constant.cmsBanner);
  }


    getProductById(id: any) {
    id = id.replace(/^"|"$/g, '');
    return this.httpService.get(
      `${constant.product}/${id}`,
    );
  }

      getCategoryById(id: any) {
    id = id.replace(/^"|"$/g, '');
    return this.httpService.get(
      `${constant.category}/${id}`,
    );
  }
        getSubCategoryById(id: any) {
    id = id.replace(/^"|"$/g, '');
    return this.httpService.get(
      `${constant.subCategory}/${id}`,
    );
  }
  

      getBrochure(id: any) {
    id = id.replace(/^"|"$/g, '');
    return this.httpService.get(
      `${constant.getBrochure}/${id}`,
    );
  }

  getProductHtml(productId: string) {
  return this.httpService.get<{ status: boolean; html: string }>(
    `https://vynaelectric.com/vyna/api/v1/product/new/${productId}`
  );
}
search(query: string) {
  if (!query) return of({ status: false, data: [] }); // safe return if empty
  query = query.trim();
  return this.httpService.get(`${constant.search}/${encodeURIComponent(query)}`);
}
      getSubCategoryByCategoryId(id: any) {
    id = id.replace(/^"|"$/g, '');
    return this.httpService.get(
      `${constant.getSubcategoryByCategory}/${id}`,
    );
  }

    getProductsBySubCategoryId(id: any) {
    id = id.replace(/^"|"$/g, '');
    return this.httpService.get(
      `${constant.getProductBySubcategory}/${id}`,
    );
  }


  getProductsByCategoryId(id: any) {
    id = id.replace(/^"|"$/g, '');
    return this.httpService.get(
      `${constant.getProductByCategory}/${id}`,
    );
  }
}
