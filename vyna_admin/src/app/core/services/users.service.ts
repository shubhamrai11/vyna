import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpService: HttpService) { }
 
  getAdmin(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`admin?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
  usersList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`api/v1/utilisateurs?page=${currentPage}&pageSize=${docPerPageCount}`);
  }
contactUs(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`content/get_contactus?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }





contactusfrom(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`contactUs?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }

productSearch(searchTerm: string): Observable<any> {
  return this.httpService.ListgetReq(
    `product/search/${searchTerm}`
  );
}





  faqList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`faq?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
   enqueryList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`faqAsk?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
    DashbaordList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`admin/dashboard-listing?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
   getCategory(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`category?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }

  getaboutusSustainbility(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`aboutusSustainbility?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
  
   getContent(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`content?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
    getAward(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`award?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
    getPromsie(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`ourpromise?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
     getVision(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`valuevision?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
    getProduct(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`product?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
    getAboutUs(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`aboutus?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
    Subcategory(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`subcategory?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
  bannerList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`banner?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
    CmsBannerList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`cmsbanner?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
   WhoWeAreList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`homewhoweare?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
getNewsLetter(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`content/getall_newletter?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }
getCatgeory(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`category?limit=${currentPage}&pageSize=${docPerPageCount}`);
  }

  
  addUsers(userData: any): Observable<any> {
    const url = `api/v1/utilisateurs/candidat/register`;
    return this.httpService.postReq(url, userData);
  }

  // get user details by id 

  getUserById(userId: any) {
    return this.httpService.ListgetReq(`api/v1/utilisateurs/${userId}`,);
  }


  getContactFormById(userId: any) {
    return this.httpService.ListgetReq(`contactUs/${userId}`,);
  }


  getContactById(userId: any) {
    return this.httpService.ListgetReq(`content/contactus/${userId}`,);
  }

  getBannerById(userId: any) {
    return this.httpService.ListgetReq(`banner/${userId}`,);
  }
   editBanner(userId: number, userData: any): Observable<any> {
    const url = `banner/${userId}`;
    return this.httpService.putReq(url, userData);
  }
   addBanner(userData: any): Observable<any> {
    const url = `banner/create-banner`;
    return this.httpService.postReq(url, userData);
  }

    getCMSBannerById(userId: any) {
    return this.httpService.ListgetReq(`cmsbanner/${userId}`,);
  }
     addCMSBanner(userData: any): Observable<any> {
    const url = `cmsbanner/create-banner`;
    return this.httpService.postReq(url, userData);
  }
   editCMSBanner(userId: number, userData: any): Observable<any> {
    const url = `cmsbanner/${userId}`;
    return this.httpService.putReq(url, userData);
  }







  getWhoWeAreById(userId: any) {
    return this.httpService.ListgetReq(`homewhoweare/${userId}`,);
  }
     addWhoWeAre(userData: any): Observable<any> {
    const url = `homewhoweare/create-about-us`;
    return this.httpService.postReq(url, userData);
  }
   editWhoWeAre(userId: number, userData: any): Observable<any> {
    const url = `homewhoweare/${userId}`;
    return this.httpService.putReq(url, userData);
  }







 getVisionById(userId: any) {
    return this.httpService.ListgetReq(`valuevision/${userId}`,);
  }
  getFaqById(userId: any) {
    return this.httpService.ListgetReq(`faq/${userId}`,);
  }
 
    getfaqAskById(userId: any) {
    return this.httpService.ListgetReq(`faqAsk/${userId}`,);
  }
    getCatgeoryById(userId: any) {
    return this.httpService.ListgetReq(`category/${userId}`,);
  }

    getaboutusSustainbilityById(userId: any) {
    return this.httpService.ListgetReq(`aboutusSustainbility/${userId}`,);
  }


  getSubcategoryByCateytgeoryId(userId: any) {
    return this.httpService.ListgetReq(`category/allcategory/${userId}`,);
  }
   getContentById(userId: any) {
    return this.httpService.ListgetReq(`content/${userId}`,);
  }
  getProductById(userId: any) {
    return this.httpService.ListgetReq(`product/${userId}`,);
  }
   getPromiseById(userId: any) {
    return this.httpService.ListgetReq(`ourpromise/${userId}`,);
  }
      getAboutusById(userId: any) {
    return this.httpService.ListgetReq(`aboutus/${userId}`,);
  }
     getAwardsById(userId: any) {
    return this.httpService.ListgetReq(`award/${userId}`,);
  }
getSUBCategoryById(userId: any) {
    return this.httpService.ListgetReq(`subcategory/${userId}`,);
  }

getSUBCategoryProductById(userId: any) {
    return this.httpService.ListgetReq(`product/subcategoryid/${userId}`,);
  }
 
  getServiceCategory(limit: number, pageSize: number): Observable<any> {
    const url = `category`;
    return this.httpService.paginationgetReq(url, limit, pageSize);
  }
  editCategory(userId: number, userData: any): Observable<any> {
    const url = `category/${userId}`;
    return this.httpService.putReq(url, userData);
  }

    editaboutusSustainbility(userId: number, userData: any): Observable<any> {
    const url = `aboutusSustainbility/${userId}`;
    return this.httpService.putReq(url, userData);
  }
    editContent(userId: number, userData: any): Observable<any> {
    const url = `content/${userId}`;
    return this.httpService.putReq(url, userData);
  }
    editProduct(userId: any, userData: any): Observable<any> {
    const url = `product/${userId}`;
    return this.httpService.putReq(url, userData);
  }




  editPromise(userId: number, userData: any): Observable<any> {
    const url = `ourpromise/${userId}`;
    return this.httpService.putReq(url, userData);
  }
     addPromise(userData: any): Observable<any> {
    const url = `ourpromise/create-ourpromise`;
    return this.httpService.postReq(url, userData);
  }






    editAbout(userId: number, userData: any): Observable<any> {
    const url = `aboutus/${userId}`;
    return this.httpService.putReq(url, userData);
  }
     addAbout(userData: any): Observable<any> {
    const url = `aboutus/create-aboutus`;
    return this.httpService.postReq(url, userData);
  }
    editAward(userId: number, userData: any): Observable<any> {
    const url = `award/${userId}`;
    return this.httpService.putReq(url, userData);
  }
   addAward(userData: any): Observable<any> {
    const url = `award/create-award`;
    return this.httpService.postReq(url, userData);
  }
    addCategeory(userData: any): Observable<any> {
    const url = `category/create-category`;
    return this.httpService.postReq(url, userData);
  }
      addProduct(userData: any): Observable<any> {
    const url = `product/create-product`;
    return this.httpService.postReq(url, userData);
  }
  editVision(userId: number, userData: any): Observable<any> {
    const url = `valuevision/${userId}`;
    return this.httpService.putReq(url, userData);
  }
    addVision(userData: any): Observable<any> {
    const url = `valuevision/create-valuevision`;
    return this.httpService.postReq(url, userData);
  }
editSubCategory(userId: number, userData: any): Observable<any> {
    const url = `subcategory/${userId}`;
    return this.httpService.putReq(url, userData);
  }
    addSubCategeory(userData: any): Observable<any> {
    const url = `subcategory/create-subcategory`;
    return this.httpService.postReq(url, userData);
  }

 editFaq(userId: number, userData: any): Observable<any> {
    const url = `faq/${userId}`;
    return this.httpService.putReq(url, userData);
  }
    // API Method for the project 
  addFaq(userData: any): Observable<any> {
    const url = `faq/create-faq`;
    return this.httpService.postReq(url, userData);
  } 


    AdminProfileUpdate(userData: any): Observable<any> {
    const url = `admin/update-profile`;
    return this.httpService.patchReq(url, userData);
  }
 editContactUs(userId: number, userData: any): Observable<any> {
    const url = `content/contactus/${userId}`;
    return this.httpService.putReq(url, userData);
  }

  // API Method for the project 
  addProject(userData: any): Observable<any> {
    const url = `api/v1/projets`;
    return this.httpService.postReq(url, userData);
  }
  // get project list 

  getprojectList(page: number, pageSize: number): Observable<any> {
    const url = `api/v1/projets`;
    return this.httpService.paginationgetReq(url, page, pageSize);
  }

  getProject(projectId: number): Observable<any> {
    const url = `api/v1/projets/${projectId}`;
    return this.httpService.ListgetReq(url);
  }

// method to get projects counts//
getProjectCounts(projectId: number): Observable<any> {
  const url = `api/v1/projets/counts`;
  return this.httpService.ListgetReq(url);
}
  // Method to get associate property//
  getAssociateProperty(projectId: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/images`,);
  }
  // get Notaire list


  getNotaireList(page: number, pageSize: number): Observable<any> {
    const url = `api/v1/parametrage/notaire`;
    return this.httpService.paginationgetReq(url, page, pageSize);
  }

  getAllNotaireList(): Observable<any> {
    const url = `api/v1/parametrage/notaire/all`
    return this.httpService.ListgetReq(url);
  }

  // get by notaire id 
  getNotaire(id: any) {
    return this.httpService.ListgetReq(`api/v1/parametrage/notaire/${id}`,);
  }


  // add notaire 

  addNotaire(userData: any): Observable<any> {
    const url = `api/v1/parametrage/notaire`;
    return this.httpService.postReq(url, userData);
  }
  // updateNotaire


  editNotaire(userId: number, userData: any): Observable<any> {
    const url = `api/v1/parametrage/notaire/${userId}`;
    return this.httpService.putReq(url, userData);
  }


  // get viabilisations
  getviabilisations(page: number, pageSize: number): Observable<any> {
    const url = `api/v1/parametrage/viabilisations`
    return this.httpService.paginationgetReq(url, page, pageSize);
  }

  // get viabilisations
  getAllViabilisations(): Observable<any> {
    const url = `api/v1/parametrage/viabilisations/all`
    return this.httpService.ListgetReq(url);
  }
  // add viabilisations


  addViabilisations(userData: any): Observable<any> {
    const url = `api/v1/parametrage/viabilisations`;
    return this.httpService.postReq(url, userData);
  }
  // updateNotaire


  editViabilisations(userId: number, userData: any): Observable<any> {
    const url = `api/v1/parametrage/viabilisations/${userId}`;
    return this.httpService.putReq(url, userData);
  }


  // get Viabilisations by id 


  getViabilisationsId(viabilisationId: any) {
    return this.httpService.ListgetReq(`api/v1/parametrage/viabilisations/${viabilisationId}`,);
  }
  // delete Account 

  DeleteAccount(userId: number): Observable<any> {
    const url = `/${userId}`;
    return this.httpService.deleteReq(url);
  }
    DeleteForm(userId: number): Observable<any> {
    const url = `contactUs/${userId}`;
    return this.httpService.deleteReq(url);
  }
deleteNewLetter(categoryId: number): Observable<any> {
    const url = `content/newletter/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
  deleteFaq(categoryId: number): Observable<any> {
    const url = `faq/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
   deleteEnquery(categoryId: number): Observable<any> {
    const url = `faqAsk/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
   deleteCategory(categoryId: number): Observable<any> {
    const url = `category/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
     deletePromsie(categoryId: number): Observable<any> {
    const url = `ourpromise/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
    deleteAward(categoryId: number): Observable<any> {
    const url = `award/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
    deleteVision(categoryId: number): Observable<any> {
    const url = `valuevision/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
     deleteProduct(categoryId: number): Observable<any> {
    const url = `product/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
   highlightProduct(categoryId: number): Observable<any> {
    const url = `product/highlight_change_status/${categoryId}`;
    return this.httpService.putReq1(url);
  }
   deleteSubcategory(categoryId: number): Observable<any> {
    const url = `subcategory/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
   deleteBanner(categoryId: number): Observable<any> {
    const url = `banner/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
 deleteCmsBanner(categoryId: number): Observable<any> {
    const url = `cmsbanner/${categoryId}`;
    return this.httpService.deleteReq(url);
  }
   deleteWhoWeAre(categoryId: number): Observable<any> {
    const url = `homewhoweare/${categoryId}`;
    return this.httpService.deleteReq(url);
  }

     deleteProductImage(categoryId: number , imageId:any): Observable<any> {
    const url = `product/${categoryId}/image/${imageId}`;
    return this.httpService.deleteReq(url);
  }

     deleteProductImage1(categoryId: number , imageId:any): Observable<any> {
    const url = `product/${categoryId}/image1/${imageId}`;
    return this.httpService.deleteReq(url);
  }

    deleteWhoWeAreImage(categoryId: number , imageId:any): Observable<any> {
    const url = `homewhoweare/${categoryId}/image/${imageId}`;
    return this.httpService.deleteReq(url);
  }
     deleteAboutImage(categoryId: number , imageId:any): Observable<any> {
    const url = `aboutus/${categoryId}/image/${imageId}`;
    return this.httpService.deleteReq(url);
  }
  getNotification(id: any) {
    return this.httpService.ListgetReq(`api/v1/utilisateurs/notifications/${id}`,);
  }

  // de activate account 

  deactivateAccount(userId: number, userData: any): Observable<any> {
    const url = `api/v1/utilisateurs/bloquerCompte/${userId}`;
    return this.httpService.postReq(url, userData);
  }

  // re activate account 

  activateAccount(userId: number, userData: any): Observable<any> {
    const url = `api/v1/utilisateurs/debloquerCompte/${userId}`;
    return this.httpService.postReq(url, userData);
  }

  verifyOtp(userData: any): Observable<any> {
    const url = `api/v1/utilisateurs/activation`;
    return this.httpService.postReq(url, userData);
  }

  forgotpassword(payload: any): Observable<any> {
    return this.httpService.postReq(`admin/forgot-password`, payload);
  }

  // method to reset password

  changedPassword(id: number, userData: any): Observable<any> {
    const url = `admin/reset-password`;
    return this.httpService.postReq(url, userData);
  }






  verifyLink( userData: any): Observable<any> {
    const url = `admin/verify_forgot_password`;
    return this.httpService.postReq(url, userData);
  }

  changedAdminPassword(id: number, userData: any): Observable<any> {
    const url = `admin/change-password`;
    return this.httpService.postReq(url, userData);
  }




  // method to add property 



  addProperty(projectId: number, userData: any): Observable<any> {
    const url = `api/v1/biens/${projectId}`;
    return this.httpService.postReq(url, userData);
  }

  // method to get property list 
  propertyList(docPerPageCount: number = 25, currentPage: number = 0, projetId: any): Observable<any> {
    return this.httpService.ListgetReq(`api/v1/biens?page=${currentPage}&pageSize=${docPerPageCount}&projetId=${projetId}`);
  }
  // Method to update Phases //
  updateProperty(projectId: any, data: any) {
    return this.httpService.postReq(`api/v1/biens/${projectId}`, data);
  }

  // Method to get Phases //
  getPropertyId(beins: any) {
    return this.httpService.ListgetReq(`api/v1/biens/${beins}`);
  }



  // get the phases data 

  // Method to get associate property//
  getPhases(projectId: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/phases`,);
  }

  // Method to get Phases //
  getPhasesById(projectId: any, PHASE_ID: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/phases/${PHASE_ID}`,);
  }


  // Method to update Phases //
  updatePhasesById(projectId: any, data: any) {
    return this.httpService.putReq(`api/v1/projets/${projectId}/phases`, data);
  }


  // Method to add Phases //
  addPhasesById(projectId: any, data: any) {
    return this.httpService.postReq(`api/v1/projets/${projectId}/phases`, data);
  }

  // Method to get Phases //
  deletePhasesById(projectId: any, PHASE_ID: any) {
    return this.httpService.deleteReq(`api/v1/projets/${projectId}/phases/${PHASE_ID}`,);
  }









  // get the documnets data 

  // Method to get associate property//
  getDocuments(projectId: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/documents`,);
  }

  // Method to get documents //
  getDocumentsById(projectId: any, documents: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/documents/${documents}`,);
  }


  // Method to update documents //
  updateDocumentsById(projectId: any,documentId:any, data: any) {
    return this.httpService.putReq(`api/v1/projets/${projectId}/documents/${documentId}`, data);
  }
  // Method to add documents //
  addDocumentsById(projectId: any, data: any) {
    return this.httpService.postReq(`api/v1/projets/${projectId}/documents`, data);
  }



  // Method to get images //
  deleteDocumentsById(projectId: any, documents: any) {
    return this.httpService.deleteReq(`api/v1/projets/${projectId}/documents/${documents}`,);
  }


  // get images dataa
  // method to get images by project id 
  getImages(projectId: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/images`,);
  }

  // Method to get images //
  getImagesById(projectId: any, images: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/images/${images}`,);
  }


  // Method to update images //
  addImagesById(projectId: any, data: any) {
    return this.httpService.postReq(`api/v1/projets/${projectId}/images`, data);
  }


  // Method to get images //
  deleteImagesById(projectId: any, images: any) {
    return this.httpService.deleteReq(`api/v1/projets/${projectId}/images/${images}`,);
  }











  // get property dataa
  // method to get Property by project id 
  getPropertyList(page: number, pageSize: number, projetId: any): Observable<any> {
    const url = `api/v1/biens`;
    return this.httpService.paginationgetReqBeins(url, page, pageSize, projetId);
  }


  // Method to get Property //
  getPropertyById(projectId: any, biens: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/biens/${biens}`,);
  }


  // Method to update Property //
  addPropertyById(projectId: any, data: any) {
    return this.httpService.postReq(`api/v1/projets/${projectId}/biens`, data);
  }

  deletePropertyByPropertyId(propertyId: any){
    return this.httpService.deleteReq(`/api/v1/biens/${propertyId}`,);

  }

  // Method to get biens //
  deletePropertyById(projectId: any, biens: any) {
    return this.httpService.deleteReq(`api/v1/projets/${projectId}/biens/${biens}`,);
  }

  // Method to get biens //
  updatePropertyById(beins: any, data: any) {
    return this.httpService.postReq(`api/v1/biens/change/${beins}`, data);
  }

  getPropertyCount(){
    const url = `api/v1/biens/counts`
    return this.httpService.ListgetReq(url);
  }




  //  method to for plan -paiement 
  // method to get PlanPayment by project id 
  getPlanPaymentList(projetId: any): Observable<any> {
    const url = `api/v1/projets/${projetId}/phases/plan-paiement`;
    return this.httpService.ListgetReq(url);
  }


  // Method to get PlanPayments //
  getPlanPaymentByPhases(projectId: any, phases: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/phases/${phases}/plan-paiement`,);
  }
  getPlanPaymentByPlanId(projectId: any, phases: any, planId: any) {
    return this.httpService.ListgetReq(`api/v1/projets/${projectId}/phases/${phases}/plan-paiement/${planId}`,);
  }

  // Method to add PlanPayment //
  addPlanPaymentById(projectId: any, phases: any, data: any) {
    return this.httpService.postReq(`api/v1/projets/${projectId}/phases/${phases}/plan-paiement`, data);
  }


  // Method to get PlanPayment //
  deletePlanPaymentById(projectId: any, phases: any, planId: any) {
    return this.httpService.deleteReq(`api/v1/projets/${projectId}/phases/${phases}/plan-paiement/${planId}`);
  }

  // Method to get PlanPayment //
  updatePlanPaymentById(projet: any, phases: any, data: any) {
    return this.httpService.putReq(`api/v1/projets/${projet}/phases/${phases}/plan-paiement`, data);
  }














  // method to get images by project id 

  getProjectImage(projetId: any): Observable<any> {
    const url = `api/v1/projets/${projetId}/imagesFiles`;
    return this.httpService.ListgetReq(url);
  }
  getProjectImageById(projetId: any, imageId: any): Observable<any> {
    const url = `api/v1/projets/${projetId}/imageFile/${imageId}`;
    return this.httpService.ListgetReq(url);
  }


  getProjectCount(){
    const url = `api/v1/projets/counts`
    return this.httpService.ListgetReq(url);
  }



  // method--to--serach Images

 
}