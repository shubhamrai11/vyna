import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpService: HttpService) { }

  usersList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`api/v1/utilisateurs?page=${currentPage}&pageSize=${docPerPageCount}`);
  }



  addUsers(userData: any): Observable<any> {
    const url = `api/v1/utilisateurs/candidat/register`;
    return this.httpService.postReq(url, userData);
  }

  // get user details by id 

  getUserById(userId: any) {
    return this.httpService.ListgetReq(`api/v1/utilisateurs/${userId}`,);
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
    const url = `api/v1/utilisateurs/${userId}`;
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
    return this.httpService.patchReq(`api/v1/utilisateurs/lost-password`, payload);
  }

  // method to reset password

  changedPassword(id: number, userData: any): Observable<any> {
    const url = `api/v1/utilisateurs/${id}/change-password`;
    return this.httpService.patchReq(url, userData);
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
}