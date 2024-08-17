import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  public loggedIn: boolean = false;
  private apiL =environment.apiUrl+'/login';

  constructor(private http: HttpClient,
              private router : Router) {
    this.loggedIn = localStorage.getItem('loggedIn') === 'true';

  }

  verifForgetPasswor(email: string, secretKey: string): Observable<any> {
    const url = `${this.apiL}/getVerifForget`;
    const body = { email, secretKey };
    return this.http.post<User>(url, body);
  }



  updatePassword(userId: number, newPassword: string): Observable<boolean> {
    const url = `${this.apiL}/${userId}/update-password`;
    const body = { newPassword };
    return this.http.put<boolean>(url, body);
  }


}
