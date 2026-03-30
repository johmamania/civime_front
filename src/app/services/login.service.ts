import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { SweetAlertIcon } from 'sweetalert2';

export interface JwtRequest {
  username: string;
  password: string;
  token: string; // token de reCAPTCHA
}
export interface ApiResponse<T> {  message: string;  data: T;}
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private url: string = `${environment.HOST}/login`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(jwtRequest: JwtRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.url}/ad`, jwtRequest);
  }

  logout() {
    sessionStorage.clear();
 //   sessionStorage.removeItem(environment.recaptcha.siteKey);
    this.router.navigate(['login']);
  }

  verifyCode(verificationRequest: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.url}/verify`, verificationRequest);
  }

  isLogged(){
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }
}
