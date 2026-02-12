import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpLoadingService {

  private _loading: boolean = false;
  loadingStatus: BehaviorSubject<boolean> =  new BehaviorSubject( this._loading );
  
  get loading(): boolean {
    return this._loading;
  }

  set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }
}