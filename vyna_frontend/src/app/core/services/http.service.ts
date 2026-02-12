
import { HttpClient ,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const LOCALURL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class HttpService  {
  constructor(private http : HttpClient) {}
  getReq(url: string, options?: { headers?: { accept: string } }): Observable<any> {
    const fullUrl = `${url}`;
  //  console.log('fullUrl--',fullUrl)
    return this.http.get(fullUrl, { responseType: 'text', ...options });
  }
  ListgetReq(url: String) : Observable<any>
  {
    return this.http.get(`${LOCALURL}/${url}`);
  }

  loginPostReq(url: string, payload: any, headers?: HttpHeaders): Observable<any> {
    return this.http.post(`${LOCALURL}/${url}`, payload, { headers });
  }
  
  postReq(url : String , payload : any) : Observable<any>
  {
    return this.http.post(`${LOCALURL}/${url}` , payload);
  }

  patchReq(url : String  , payload : any) : Observable<any>
  {
    return this.http.patch(`${LOCALURL}/${url}` , payload);
  } 

  deleteReq(url : String) : Observable<any>
  {
    return this.http.delete(`${LOCALURL}/${url}`);
  }
  putReq(url: string, payload: any): Observable<any> {
    return this.http.put(`${LOCALURL}/${url}`, payload);
  }
  

  paginationgetReq(url: string, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get(`${LOCALURL}/${url}`, { params });
  }
  

  
  paginationgetReqBeins(url: string, page: number, pageSize: number ,projetId:any): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('projetId', projetId.toString());
    return this.http.get(`${LOCALURL}/${url}`, { params });
  }
  

  paginationgetReqpayment(url: string, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
    return this.http.get(`${LOCALURL}/${url}`, { params });
  }
}




