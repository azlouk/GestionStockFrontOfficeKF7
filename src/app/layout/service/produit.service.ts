import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {DatePipe, JsonPipe} from "@angular/common";
import {ConfirmationService, MessageService} from "primeng/api";
import {Observable} from "rxjs";
import {getToken, getUserDecodeID} from "../../../main";
import {Vente} from "../../models/Vente";
import {Article} from "../../models/Article";
import {Produit} from "../../models/produit";
import Swal from "sweetalert2";
import {Historique} from "../../models/historique";
import {Page} from "../../models/page";

@Injectable({
    providedIn: 'root'
})
export class ProduitService {

    listvente: Vente[] = [];

    produits: Produit[] = [];
    private api = environment.apiUrl + '/produit'
    private apiarticle = environment.apiUrl + '/articles'
    private apivente = environment.apiUrl + '/vente'
    private apilignevente = environment.apiUrl + '/ligneVente'

    public apifile = environment.apiUrl + '/api/'
    public apifilePrime = environment.apiUrl + '/api/uploadFilesIntoDB'

    produitsFactures: Produit[] = [];
    nbProduit: number = 0;
    public permission: any;
    public permissionArticle: any;
    public CodeBarreSharing: string = '';


    constructor(private http: HttpClient,
                private router: Router,
                private datePipe: DatePipe,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
    ) {
    }


    getProduits(): Observable<Produit[]> {
        const url = `${this.api}/DtoRead`;
        const token = getToken();
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            return this.http.get<Produit[]>(url, {headers});

        } else {
            return new Observable();
        }
    }

    LoadProduits(page: number, size: number): Observable<Page<Produit>> {
        const url = `${this.api}/DtoRead?page=${page}&size=${size}`;
        const token = getToken();

        if (token) {
            const headers = new HttpHeaders()
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json; charset=utf-8');

            return this.http.get<Page<Produit>>(url, {headers});
        } else {
            return new Observable();
        }
    }


    getProduitById(id: number): Observable<Produit> {
        const url = `${this.api}/findById`;
        const token = getToken();

        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            return this.http.get<Produit>(url + '/' + id, {headers});
        } else {
            return new Observable();
        }
    }

    getProduitByArticle(articleId: number): Observable<Produit[]> {
        const url = `${this.api}/getAllProductByArticle`;

        const token = getToken();

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête
            return this.http.get<Produit[]>(url + '/' + articleId, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }

    getProduitOrderByQtyVDesc(): Observable<Produit[]> {
        const url = `${this.apilignevente}/getproduitdesc`;
        const token = getToken();
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête
            return this.http.get<Produit[]>(url, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }

    searchProduit(term: string, pr: Produit[]): Produit[] {
        term = term.toLowerCase();
        return pr.filter((produit: Produit) =>
            produit._nom.toLowerCase().indexOf(term) !== -1 || produit._description.indexOf(term) !== -1
        );
    }

    addProduit(nouveauProduit: Produit, uploadFiles: any[]) {
        const token = getToken();

        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            let formData = new FormData();
            const produit = nouveauProduit
            formData.append('produit', new Blob([JSON
                .stringify(produit.toJSON())], {
                type: 'application/json'
            }));
            for (let i = 0; i < uploadFiles.length; i++) {
                formData.append('file', uploadFiles[i]);
            }

            console.log(produit.toJSON())
            // Utiliser les headers dans la require
            return this.http.post<any>(this.api + '/create', formData, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }

    }

    shouldStayOnSamePageOrder(): boolean {
        const currentUrl = this.router.url;
        return currentUrl.includes('/edit-produit');
    }

    modifierProduit(nouveauProduit: Produit, uploadFiles: any[]): any {
        const token = getToken();

        if (token) {

            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            let formData = new FormData();
            const produit = nouveauProduit
            formData.append('produit', new Blob([JSON
                .stringify(produit)], {
                type: 'application/json'
            }));
            for (let i = 0; i < uploadFiles.length; i++) {
                formData.append('file', uploadFiles[i]);
            }
            console.log(nouveauProduit)
            // Utiliser les headers dans la require
            return this.http.put<any>(this.api + '/update', formData, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }

    }

    supprimerProduit(id: number): Observable<any> {

        const token = getToken();
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête
            return this.http.delete<any>(this.api + '/delete/' + id, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }

    }

    getImageProduit(name: string): Observable<Blob> {
        const token = getToken();
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête
            return this.http.get(this.apifile + 'getFileByName/' + name, {headers, responseType: 'blob'});
        } else {
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }

    getProduitByQrNom(data: string): Observable<Produit> {
        const url = `${this.api}/findByDataqr`;

        // Récupérer le token d'authentification depuis le stockage local (à adapter selon votre méthode d'authentification)
        const token = getToken();
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête
            return this.http.get<Produit>(url + '/' + data, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }


    SaveVente(vente: Vente) {


        const token = getToken();


        if (token) {
            // Ajouter le token à l'en-tête de la requête

            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

            let ligneventes: any[] = [];
            vente.lignesVente.forEach(value => {

                    ligneventes.push(
                        {
                            "qtyV": value.venteQty,
                            "prixVente": value.prixVente,
                            "produit": {
                                "id": value.produit.id
                            }
                        }
                    )
                }
            )

            const venteSave = {
                "paye": vente.paye,
                "dateVente": this.datePipe.transform(vente.dateVente, 'dd-MM-yyyy'),
                "client": {"id": vente.client.id},
                "total": vente.total,
                "reglement": vente.reglement,
                "lignesVente": ligneventes,
                "employer": {"id": vente.employer.id}
            }


            // Utiliser les headers dans la require
            return this.http.post<any>(this.apivente + '/create', venteSave, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }

    }


    getArticles(): Observable<Article[]> {
        const url = `${this.apiarticle}/read`;

        const token = getToken();
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête
            return this.http.get<Article[]>(url, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }


    deleteArticle(article: Article): Observable<any> {
        const url = `${this.apiarticle}/delete/` + article.id;

        // Récupérer le token d'authentification depuis le stockage local (à adapter selon votre méthode d'authentification)
        const token = getToken();
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête
            return this.http.delete<any>(url, {headers});
        } else {
            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }

    addArticle(article: Article): Observable<any> {
        const url = `${this.apiarticle}/create`;

        // Récupérer le token d'authentification depuis le stockage local (à adapter selon votre méthode d'authentification)
        const token = getToken();
        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");

            // Utiliser les headers dans la requête

            return this.http.post<any>(url, article, {headers});
        } else {

            // Gérer le cas où le token n'est pas disponible
            return new Observable(); // Vous pouvez également renvoyer une erreur ou effectuer d'autres actions
        }
    }

    exist(tableName: String) {
        const token = getToken();

        if (token) {
            // Ajouter le token à l'en-tête de la requête
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            let data: any = {
                "user": {
                    "id": getUserDecodeID().id
                },
                "tableName": tableName,

            }
            this.http.post<boolean>(environment.apiUrl + '/permission/checkpermission', data, {headers}).subscribe(value => {
                this.permission = value;
            })

        } else {
            this.permission = false;

        }
    }

//   =====================article============
    existArticle(tableName: String) {
        const token = getToken();

        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            let data: any = {
                "user": {
                    "id": getUserDecodeID().id
                },
                "tableName": tableName,

            }
            this.http.post<boolean>(environment.apiUrl + '/permission/checkpermission', data, {headers}).subscribe(value => {
                this.permissionArticle = value;
            })

        } else {
            this.permissionArticle = false;

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
                this.router.navigate(['/uikit/produits']);
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

//   ============historique==================

    getHistoriques(id: Number): Observable<Historique[]> {
        const url = `${this.api}/historiques`;
        const token = getToken();
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            return this.http.get<Historique[]>(url + '/' + id, {headers});

        } else {
            return new Observable();
        }
    }


}
