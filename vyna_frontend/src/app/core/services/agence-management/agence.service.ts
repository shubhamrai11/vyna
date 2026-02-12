import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  constructor(private httpService: HttpService) { }

  agenceList(docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    return this.httpService.ListgetReq(`api/v1/agence/parametrage?page=${currentPage}&pageSize=${docPerPageCount}`);
  }

  // get agence details by id 

  getAgenceById(agenceId: any) {
    return this.httpService.ListgetReq(`api/v1/agence/parametrage/${agenceId}`,);
  }

  addAgentImmobilier(agenceData: any): Observable<any> {
    const url = `api/v1/agence/parametrage/agent-immobilier/register`;
    return this.httpService.postReq(url, agenceData);
  }

  // get Agence id 
  getAgenceList(): Observable<any> {
    const url = `api/v1/agence/parametrage`
    return this.httpService.ListgetReq(url);
  }

  // add notaire 

  addAgence(agenceData: any): Observable<any> {
    const url = `api/v1/agence/parametrage`;
    return this.httpService.postReq(url, agenceData);
  }

  // updateAgence

  editAgence(agenceId: string, agenceData: any): Observable<any> {
    const url = `api/v1/agence/parametrage/${agenceId}`;
    return this.httpService.putReq(url, agenceData);
  }

}
