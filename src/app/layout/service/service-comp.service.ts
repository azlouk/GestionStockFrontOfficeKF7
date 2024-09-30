import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {SERVICE} from "../../models/SERVICE";
import {getToken} from "../../../main";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {JsonPipe} from "@angular/common";
import {ServiceComp} from "../../models/ServiceComp";

@Injectable({
  providedIn: 'root'
})
export class ServiceCompService {
  private api =environment.apiUrl+'/servicecomp';
  constructor(private http : HttpClient) { }

  getServices(): Observable<ServiceComp[]> {
    const token = getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
      return this.http.get<ServiceComp[]>(`${this.api}/read`,{headers});
    }else {
      return  new Observable<ServiceComp[]>() ;
    }
  }
  getServiceById(id:any): Observable<ServiceComp> {
    const token = getToken();

    if (token) {
      // Ajouter le token à l'en-tête de la requête
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

      return this.http.get<ServiceComp>(`${this.api}/getServiceCompById/`+id,{headers});

    }else {
      return  new Observable<ServiceComp>() ;
    }
  }

  addService(newService: ServiceComp): Observable<any> {
    const token = getToken(); // Assurez-vous que cette méthode renvoie bien un token valide
    if (token) {
      // Ajouter le token à l'en-tête de la requête
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      });

      // Préparer les données à envoyer (ajuster selon les besoins)
      const serviceData = {
        ...newService,
        dateDebutService: this.formatDate(newService.dateDebutService),
        dateFinService: this.formatDate(newService.dateFinService),
        users: newService.users.map(user => ({ id: user.id })) // Transformer les utilisateurs si nécessaire
      };

      // Envoyer la requête POST
      return this.http.post<any>(`${this.api}/create`, serviceData, { headers });
    } else {
      // Gérer le cas où le token n'est pas disponible
      return new Observable(observer => {
        observer.error('Token non disponible');
      });
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateService(newService: ServiceComp): Observable<ServiceComp> {
    const token = getToken();


    if (token) {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set("Content-Type", "application/json; charset=utf8");

      let serv: any = { ...newService, users: [] }; // Initialiser 'users' comme un tableau vide

      newService.users.forEach(value => {
        serv.users.push({ id: value.id });
      });


      return this.http.put<any>(`${this.api}/update`, serv, { headers });
    } else {
      return new Observable(); // Gérer le cas où le token n'est pas disponible
    }
  }

  deleteService(serviceId: number): Observable<any> {
    const token = getToken();

    if (token) {
      // Ajouter le token à l'en-tête de la requête
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

      // Utiliser les headers dans la requête
      return this.http.delete<any>(this.api + '/delete/' + serviceId, {headers});
    } else {
      // Gérer le cas où le token n'est pas disponible
      return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
    }
  }
}
