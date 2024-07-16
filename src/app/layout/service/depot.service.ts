import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
import {Depot} from "../../models/Depot";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {getToken, getUserDecodeID} from "../../../main";
import {User} from "../../models/user";
import {JsonPipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DepotService {

    depots: Depot[] = [];
    private api =environment.apiUrl+'/depot';
    public permission: any ;

    constructor( private http : HttpClient,
                 private router : Router) { }

    getdepots(): Observable<Depot[]> {
        const token = getToken();
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<Depot[]>(`${this.api}/read`,{headers});
        }
        else  {
            return new Observable<Depot[]>() ;
        }
    }

    getAvailableResponsable(): Observable<User[]> {
        const token = getToken();
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<User[]>(`${this.api}/getResponsableDisponible`,{headers});
        }
        else  {
            return new Observable<User[]>() ;
        }
    }

    getDepotById(id: number): Observable<Depot> {
        const token = getToken();
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<Depot>(`${this.api}/getDepotById/${id}`,{headers})
        } else  {
            return new Observable<Depot>() ;
        }
    }
    getDepotByIdRes(id: number): Observable<Depot> {
        const token = getToken();
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<Depot>(`${this.api}/getDepotByIdRes/${id}`,{headers})
        } else  {
            return new Observable<Depot>() ;
        }
    }

    deleteDepot(id: number ): Observable<any> {
        const token = getToken();
        console.log("Call Function Depot Delete : " +id)
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.delete<any>(`${this.api}/delete/${id}`,{headers});
        }else {
            return new Observable<any>();
        }
    }

    updateDepot(updatedDepot: Depot): Observable<any> {
        const token = getToken();
        console.log("Call Function Depot Update  Responsable role: " +new JsonPipe().transform(updatedDepot.responsable.id))
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            const dep={
                "id" : updatedDepot.id,
                "nom": updatedDepot.nom,
                "adresse": updatedDepot.adresse,
                "tel": updatedDepot.tel,
                "capitale": updatedDepot.capitale,
                "description": updatedDepot.description,
                "responsable": {
                    "id": updatedDepot.responsable.id,

                },
                "factures": []
            }



            return this.http.put<any>(`${this.api}/update`,dep,{headers});
        }else {
            return new Observable<any>();
        }
    }

    addDepot(nouveauDepot : Depot):Observable<any> {
        const token = getToken();
        console.log(token)
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.post<any>(`${this.api}/createDto`,nouveauDepot,{headers});
        }else {
            return new Observable<any>();
        }

    }

    returnBack() {
        console.log('Bouton cliqué');
        Swal.fire({
            title: 'Vous êtes sûr?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('Confirmation reçue');
                this.router.navigate(['/depot']);
            } else {
                console.log('Annulation reçue');
                Swal.fire({
                    title: 'Annulation',
                    icon: 'info',
                    text: 'Le retour a été annulé.'
                });
            }
        });
    }
    exist(tableName:String) {
        const token = getToken();
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            let data :any={
                "user": {
                    "id": getUserDecodeID().id
                },
                "tableName": tableName,

            }
            this.http.post<boolean>(environment.apiUrl + '/permission/checkpermission', data, { headers }).subscribe(value => {
                this.permission=value ;
                console.log("=======1111111>><>>>>>> "+new JsonPipe().transform(this.permission));
            })

        }else {
            this.permission =false ;

        }
    }
}

