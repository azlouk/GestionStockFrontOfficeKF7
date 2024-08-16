import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Statistic} from "../../models/Statistic";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/internal/Observable";
import {getToken} from "../../../main";

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {


  public statistic :Statistic;
  private api = environment.apiUrl+'/admin'

  constructor(private http :HttpClient ) {
    this.statistic=new Statistic() ;
  }


  getStatistic() :Observable<Statistic> {
    const url = `${this.api}/statistic`;
    const token = getToken();
    console.log(token)
    if (token) {
      // Ajouter le token à l'en-tête de la requête
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type","application/json; charset=utf8" );

      // Utiliser les headers dans la requête
      return  this.http.get<Statistic>(url, {headers} )
    } else {
      // Gérer le cas où le token n'est pas disponible
      return new Observable<Statistic>()
    }
  }
}
