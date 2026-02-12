import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { HttpLoadingService } from "../services/http-loading.service";

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

  activeRequests: number = 0;
  
    /**
     * URLs for which the loading should not be enabled
     */
    skippUrls = [
      '/refreshtoken',
      '/home'
    ];
  
    constructor(private httpLoadingService: HttpLoadingService) {
    }
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let displayLoadingScreen = true;
  
      for (const skippUrl of this.skippUrls) {
        if (new RegExp(skippUrl).test(request.url)) {
          displayLoadingScreen = false;
          break;
        }
      }
  
      if (displayLoadingScreen) {
        if (this.activeRequests === 0) {
          this.httpLoadingService.startLoading();
        }
        this.activeRequests++;
  
        return next.handle(request).pipe(
          finalize(() => {
            this.activeRequests--;
            if (this.activeRequests === 0) {
              setTimeout(() => {
                this.httpLoadingService.stopLoading();                
              }, 500);
            }
          })
        )
      } else {
        return next.handle(request);
      }
    };
}

export const HttpLoadingInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true }
];
