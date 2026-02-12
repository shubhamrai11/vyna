import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader = new Subject();
  profileImageSubject = new BehaviorSubject<any>(null);

  constructor() { }

  setProfileImage(image: string | ArrayBuffer | null) {
    this.profileImageSubject.next(image);
  }

  getProfileImage() {
    return this.profileImageSubject as Observable<any>;
  }
  
  setLoader(value: any) {
    this.loader.next(value);
  }

  getLoader() {
    return this.loader.asObservable();
  }
  
}
