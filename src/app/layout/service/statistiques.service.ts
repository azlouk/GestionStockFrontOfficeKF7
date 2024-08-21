import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Statistic} from "../../models/Statistic";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/internal/Observable";
import {getToken} from "../../../main";
import {  throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {


  public statistic :Statistic;
  private api = environment.apiUrl+'/admin'

  constructor(private http :HttpClient ) {
    this.statistic=new Statistic() ;
  }


  getStatistic(): Observable<Statistic> {
    const url = `${this.api}/statistic`;
    const token = getToken();
    console.log('Token:', token);

    if (token) {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get<Statistic>(url, { headers }).pipe(
          tap(response => console.log('Réponse reçue :', response)),
          catchError(error => {
            console.error('Erreur lors de la récupération des statistiques :', error);
            return throwError(error);
          })
      );
    } else {
      // Gérer le cas où le token n'est pas disponible
      return new Observable<Statistic>();
    }
  }

  getVentesGainParJour(): Observable<{ [date: string]: number }> {
    const url = `${this.api}/ventes-gains-par-jour`;
    const token = getToken(); // Fonction pour obtenir le token d'authentification
    console.log('Token:', token);

    if (token) {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get<{ [date: string]: number }>(url, { headers }).pipe(
          tap(response => console.log('Ventes par jour reçues :', response)),
          catchError(error => {
            console.error('Erreur lors de la récupération des ventes par jour :', error);
            return throwError(error);
          })
      );
    } else {
      // Gérer le cas où le token n'est pas disponible
      return new Observable<{ [date: string]: number }>();
    }
  }
  getFacturesGainParJour(): Observable<{ ventes: { [date: string]: number }, gains: { [date: string]: number } }> {
    const url = `${this.api}/factures-gains-par-jour`;
    const token = getToken(); // Fonction pour obtenir le token d'authentification
    console.log('Token:', token);

    if (token) {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get<{ ventes: { [date: string]: number }, gains: { [date: string]: number } }>(url, { headers }).pipe(
          tap(response => console.log('Données des factures et gains reçues :', response)),
          catchError(error => {
            console.error('Erreur lors de la récupération des factures et gains :', error);
            return throwError(error);
          })
      );
    } else {
      // Gérer le cas où le token n'est pas disponible
      return new Observable<{ ventes: { [date: string]: number }, gains: { [date: string]: number } }>();
    }
  }

  getVentesEtGainsParMois(): Observable<{ [key: string]: { [key: string]: number } }> {
    const url = `${this.api}/ventes-gains-par-mois`;
    const token = getToken(); // Remplacez cette fonction par votre méthode d'obtention du token

    if (token) {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get<{ [key: string]: { [key: string]: number } }>(url, { headers }).pipe(
          tap(response => console.log('Données des ventes et gains reçues :', response)),
          catchError(error => {
            console.error('Erreur lors de la récupération des ventes et gains :', error);
            return throwError(error);
          })
      );
    } else {
      return new Observable<{ [key: string]: { [key: string]: number } }>();
    }
  }

  getFacturesEtGainsParMois(): Observable<{ [key: string]: { [key: string]: number } }> {
    const url = `${this.api}/factures-et-gains-par-mois`;
    const token = getToken(); // Remplacez cette fonction par votre méthode d'obtention du token

    if (token) {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get<{ [key: string]: { [key: string]: number } }>(url, { headers }).pipe(
          tap(response => console.log('Données des ventes et gains reçues :', response)),
          catchError(error => {
            console.error('Erreur lors de la récupération des ventes et gains :', error);
            return throwError(error);
          })
      );
    } else {
      return new Observable<{ [key: string]: { [key: string]: number } }>();
    }
  }
}
