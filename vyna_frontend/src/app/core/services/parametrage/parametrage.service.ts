import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrageService {

  constructor(private httpService: HttpService) { }

  parametrageList(entity: string, docPerPageCount: number = 25, currentPage: number = 0): Observable<any> {
    const url = `api/v1/parametrage/${entity}?page=${currentPage}&pageSize=${docPerPageCount}`;
    return this.httpService.ListgetReq(url);
  }

  // get parametrage details by id 
  getParametrageById(entity: string, parametrageId: any): Observable<any> {
    return this.httpService.ListgetReq(`api/v1/parametrage/${entity}/${parametrageId}`,);
  }

  // get Parametrage id 
  getParametrageList(entity: string): Observable<any> {
    const url = `api/v1/parametrage/${entity}`
    return this.httpService.ListgetReq(url);
  }

  // add parametrage 
  addParametrage(entity: string, parametrageData: any): Observable<any> {
    const url = `api/v1/parametrage/${entity}`;
    return this.httpService.postReq(url, parametrageData);
  }

  // add parametrage 
  deleteParametrage(entity: string, parametrageId: string): Observable<any> {
    const url = `api/v1/parametrage/${entity}/${parametrageId}`;
    return this.httpService.deleteReq(url);
  }

  // updateParametrage
  editParametrage(entity: string, parametrageId: any, parametrageData: any): Observable<any> {
    //console.log('parametrageId---',parametrageId.id)
    const url = `api/v1/parametrage/${entity}/${parametrageId}`;
    return this.httpService.putReq(url, parametrageData);
  }
   

  getPartenaireList(entity: string): Observable<any> {
    const url = `api/v1/parametrage/${entity}/all`
    return this.httpService.ListgetReq(url);
  }

}
