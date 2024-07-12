import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {getToken} from "../../../main";
import {Vente} from "../../models/Vente";

@Injectable({
  providedIn: 'root'
})
export class VenteService {
    private api =environment.apiUrl+'/vente';
    public show: boolean = false;


    constructor(private http: HttpClient) {
    }

    getVentes(): Observable<Vente[]> {
        const url = `${this.api}/read`;

        // Récupérer le token d'authentification depuis le stockage local (à adapter selon votre méthode d'authentification)
        const token = getToken();
        console.log(token)
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type","application/json; charset=utf8" );

            // Utiliser les headers dans la requête
            return this.http.get<Vente[]>(url, {headers} );
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }

    removeVente(id:number) {
        const url = `${this.api}/delete`;

        // Récupérer le token d'authentification depuis le stockage local (à adapter selon votre méthode d'authentification)
        const token = getToken();
        console.log(token)
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type","application/json; charset=utf8" );

            // Utiliser les headers dans la requête
            return this.http.delete<Vente[]>(url+'/'+id, {headers} );
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }
}
