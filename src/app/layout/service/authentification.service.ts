import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {deleteToken} from "../../../main";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
    public loggedIn: boolean = false;
    private api =environment.apiUrl+'/authentification';
    constructor(private http: HttpClient,
                private router : Router) {
        this.loggedIn = localStorage.getItem('loggedIn') === 'true';

    }

    login(username: string, password: string): Observable<any> {
        const body = { "email":username, "password":password };
        console.error(JSON.stringify(body))
        this.loggedIn = true;
        localStorage.setItem('loggedIn', 'true');
        return this.http.post<any>(this.api+'/authenticate', body);
    }

    logout() {
        deleteToken();
        this.loggedIn = false;
        localStorage.setItem('loggedIn', 'false');
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return this.loggedIn;
        localStorage.setItem('loggedIn', 'true');
    }
}
