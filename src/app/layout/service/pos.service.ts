import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Article} from "../../models/Article";
import {getToken} from "../../../main";

@Injectable({
  providedIn: 'root'
})
export class POSService  {
    private api =environment.apiUrl+'/article';
    constructor( private http : HttpClient) { }
    getArticles(): Observable< Article []> {
        const token = getToken();
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<Article[]>(`${this.api}/read`,{headers});
        }
        else  {
            return new Observable<Article[]>() ;
        }
    }
}
