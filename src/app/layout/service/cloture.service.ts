import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DatePipe, JsonPipe} from "@angular/common";
import {Observable} from "rxjs/internal/Observable";
import {getToken, getUserDecodeID} from "../../../main";
import {catchError} from "rxjs/internal/operators/catchError";
import {throwError} from "rxjs/internal/observable/throwError";
import {Cloture} from "../../models/Cloture";
import {Page} from "../../models/Page";
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class ClotureService {
    private api =environment.apiUrl;
    clotures : Cloture [] = [];

    constructor(private http : HttpClient ,private datePipe: DatePipe) { }


    // getUserConnecte(): Observable<any> {
    //     const token = getToken();
    //
    //
    //     if (token) {
    //         // Add the token to the request header
    //         const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    //         return this.http.get<any>(`${this.api}/cloture/userConnecte`, {
    //             headers,
    //         });
    //     } else {
    //         // Handle the case where the token is not available
    //         return new Observable(); // You can also return an error or perform other actions
    //     }
    // }

    getUserConnecte(): Observable<string> {
        const token = getToken();
        console.log(token)
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            return this.http.get<string>(`${this.api}/cloture/userConnecte`,{headers});

        }else {
            return  new Observable<any>()}
    }

    SaveCloture(cloture: Cloture): Observable<any> {
        const token = getToken();


        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

            // Assuming cloture.employer is a single User, not an array
            const clotureSave = {
                dateCloture: this.datePipe.transform(cloture.dateCloture,'dd-MM-yyyy HH:mm:ss'),
                etatCloture: cloture.etatCloture,
                montantClotureValide: cloture.montantClotureValide,
                montantClotureEspece: cloture.montantClotureEspece,
                employer: {
                    id : cloture.employer.id,
                },
            };



            // Use the headers in the request
            return this.http.put<any>(`${this.api}/cloture/clotureemployer`, clotureSave, {
                headers,
            });
        } else {
            // Handle the case where the token is not available
            return new Observable(); // You can also return an error or perform other actions
        }
    }

    addCloture(newCloture: Cloture): Observable<Cloture> {

        const token = getToken();

        if (token) {
            const headers = new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
                .set("Content-Type", "application/json; charset=utf8");

            return this.http.post<Cloture>(`${this.api}/cloture/create`, newCloture, { headers })
                .pipe(
                    catchError((error: any) => {
                        console.error('Erreur lors de la requête HTTP', error);
                        return throwError(error); // Renvoie une erreur observable pour le traitement côté composant
                    })
                );
        } else {
            return throwError("Token manquant");
        }
    }

    getClotures(): Observable<any[]> {
        const token = getToken();


        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<any[]>(`${this.api + '/cloture/read'}`, {headers});
        } else {
            return new Observable<any[]>();
        }
    }




    LoadClotures(page: number, size: number): Observable<Page<Cloture>> {
        const url = `${this.api}/cloture/DtoReadPage?page=${page}&size=${size}`;
        const token = getToken();

        if (token) {
            const headers = new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json; charset=utf-8');

            return this.http.get<Page<Cloture>>(url, {headers});
        } else {
            return new Observable();
        }
    }



    getClotureById(id: number): Observable<Cloture> {
        const url = `${this.api}/cloture/getClotureById/${id}`; // Corrected URL path
        const token = getToken();


        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<Cloture>(url, { headers });
        } else {
            return new Observable<Cloture>();
        }
    }



    getTotalClotureNow(date :Date): Observable<any> {
        const url = `${this.api}/cloture/getSommeVente`; // Corrected URL path
        const token = getToken();

        const data:any={
            "employer":{'id':getUserDecodeID().id},
            'dateCloture':this.datePipe.transform(date,'dd-MM-yyyy HH:mm:ss'),
        }



        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.post<any>(url, data,{ headers });
        } else {
            return new Observable<Cloture>();
        }
    }

    deleteCloture(id: number): Observable<any> {

        // Récupérer le token d'authentification depuis le stockage local (à adapter selon votre méthode d'authentification)
        const token = getToken();

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête
            return this.http.delete<any>(this.api + '/cloture/delete/' + id, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }

    }
    getCloturesFiltrer(id:number): Observable<any[]> {
        const token = getToken();

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<any[]>(`${this.api + `/cloture/getVentesClotureFiltrer/${id}`}`, {headers});
        } else {
            return new Observable<any[]>();
        }
    }


}
