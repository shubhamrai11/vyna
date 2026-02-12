import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public getAuthToken(): string | null {
    return localStorage.getItem('admin_token');
  }
}
