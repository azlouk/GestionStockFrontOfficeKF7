import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
import {Tranche} from "../../models/Tranche";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {getToken, getUserDecodeID} from "../../../main";
import {JsonPipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class TrancheService {
    private tranches: Tranche[] = [];
    private api =environment.apiUrl+'/tranche';
    constructor( private http : HttpClient,
                 private router : Router) { }
    public permission: any ;
    getTranches(): Observable<Tranche[]> {
        // @ts-ignore
        const token = getToken();
        console.log(token)

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<Tranche[]>(`${this.api}/read`,{headers});


        }else {
            return  new Observable<Tranche[]>() ;
        }
    }
    getTrancheById(id: number): Observable<Tranche> {
        const url = `${this.api}/getTrancheById/${id}`; // Corrected URL path
        const token = getToken();
        console.log(token);

        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<Tranche>(url, { headers });
        } else {
            return new Observable<Tranche>();
        }
    }
    rechercheTranche(keyword: string): Tranche[] {
        // Perform a case-insensitive search on nom, description, and client
        return this.tranches.filter(
            tranche =>
                tranche.montantTranche.toString().toLowerCase().includes(keyword.toLowerCase()) ||
                tranche.description.toLowerCase().includes(keyword.toLowerCase()) ||
                tranche.user.lastname.toLowerCase().includes(keyword.toLowerCase()) ||
                tranche.user.firstname.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    addTranche(newTranche: Tranche): Observable<Tranche> {
        this.tranches.push(newTranche);

        console.log("Data tranche"+new JsonPipe().transform(newTranche))
        const token = getToken();
        console.log(token);
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.post<Tranche>(this.api+'/create',newTranche,{headers});
        }else {
            return  new Observable<any>() ;
        }
    }


    deleteTranche(id: Tranche): Observable<Tranche[]> {
        const url = `${this.api}/delete`;

        // Récupérer le token d'authentification depuis le stockage local (à adapter selon votre méthode d'authentification)
        const token = getToken();
        console.log(token)
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type","application/json; charset=utf8" );

            // Utiliser les headers dans la requête
            return this.http.delete<Tranche[]>(url+'/'+id, {headers} );
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }

    modifierTranche(tranche: Tranche):Observable<Tranche> {
        const url = `${this.api}/update`;

        const token = getToken(); // Ensure you have a function to get the token
        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json; charset=utf8');

            const datatranche :any={
                "id": tranche.id,
                "description": tranche.description,
                "dateEcheance": tranche.dateEcheance,
                "montantTranche": tranche.montantTranche,
                "statutPayement": tranche.statutPayement,
                "user": {
                    "id": tranche.user.id
                },
            }
            console.error(new JsonPipe().transform(datatranche))

            return this.http.put<Tranche>(url, datatranche, { headers });
        } else {
            // Handle the case when the token is not available
            return new Observable<Tranche>();
        }
    }

    ajoutererTranche(newtranche: Tranche):Observable<Tranche> {
        const url = `${this.api}/create`;

        const token = getToken(); // Ensure you have a function to get the token
        if (token) {
            // Add the token to the request header
            const headers = new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json; charset=utf8');

            const datatranche :any={
                "id": newtranche.id,
                "description": newtranche.description,
                "dateEcheance": newtranche.dateEcheance,
                "montantTranche": newtranche.montantTranche,
                "statutPayement": newtranche.statutPayement,
                "user": {
                    "id": newtranche.user.id
                },
            }
            console.error(new JsonPipe().transform(datatranche))

            return this.http.post<Tranche>(url, datatranche, { headers });
        } else {
            // Handle the case when the token is not available
            return new Observable<Tranche>();
        }
    }
    returnBack() {
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
                this.router.navigate(['/tranches']);
                ;
            } else {
                // Handle the case where the user cancels the return
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
                console.log("=======1111111>><>>>>>> "+new JsonPipe().transform(this.permission=value));
            })

        }else {
            this.permission =false ;

        }
    }
}




