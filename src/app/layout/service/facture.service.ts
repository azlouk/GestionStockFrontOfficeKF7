import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
import {Facture, FactureInterface, factureType} from "../../models/Facture";
import {environment} from "../../../environments/environment";
import {DepotService} from "./depot.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ProduitService} from "./produit.service";
import {Router} from "@angular/router";
import {DatePipe, JsonPipe} from "@angular/common";
import {Depot} from "../../models/Depot";
import {catchError, Observable, of} from "rxjs";
import {getToken, getUserDecodeID} from "../../../main";
import {User} from "../../models/user";
import {map} from "rxjs/operators";
import {UserService} from "./user.service";
import {TrancheService} from "./tranche.service";
import {ConfirmationService, MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class FactureService {
    FactureInter : FactureInterface[]=[];
    factures: Facture[] = []; // Initialisation du tableau de factures
    // @ts-ignore
    depots: Depot[] = this.getAllDepots();
    private api =environment.apiUrl+'/facture';
    idFacture : number=0;
    public permission: any ;
    constructor(private depotService: DepotService,
                private userService: UserService,
                private http : HttpClient,
                private confirmationService:ConfirmationService,
                private messageService : MessageService,
                private produitService: ProduitService,
                private trancheService: TrancheService,
                private router : Router,
                private datePipe: DatePipe) {
        // Récupérez les détails des dépôts depuis le service Depot
        this.getAllDepots();
        this.userService.getUsers();

        const facturetype = this.getTypesFacture();
        const tranches = this.trancheService.getTranches()
    }
    getAllDepots() {
        this.depotService.getdepots().subscribe((value: Depot[]) => {
            this.depots = value;
            //  console.log('List of services:', this.services);
        });
    }
    getFactures(): Observable<any> {
        const token = getToken();
        console.log(token)
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
            return this.http.get<Facture[]>(this.api + '/read', {headers});

        }else {
            return  new Observable<Facture[]>() ;
        }
    }
    getTypesFacture(): string[] {
        const typeKeys = Object.keys(factureType) as Array<keyof typeof factureType>;
        return typeKeys.map(key => factureType[key]);
    }



    addFacture(newFacture: Facture): Observable<Facture> {
        const token = getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        let filesListes: any[] = [];
        newFacture.lignesFacture.forEach((value) => {
            value.produit.files.forEach((file) => {
                filesListes.push({
                    "id": file.id,
                    "name": file.name,
                    "type": file.type,
                    "path": file.path
                });
            });
        });

        let ligneFact: any[] = [];
        newFacture.lignesFacture.forEach(value => {
            ligneFact.push({
                "produit": {
                    "id": value.produit.id,
                    "qantite": value.produit.qantite,
                    "nom": value.produit.nom,
                    "prixUnitaire": value.produit.prixUnitaire,
                    "prixGros": value.produit.prixGros,
                    "description": value.produit.description,
                    "dataqr": value.produit.dataqr,
                    "gainUnitaire": value.produit.gainUnitaire,
                    "gainGros": value.produit.prixGros,
                    "minQuantiteGros": value.produit.minQuantiteGros,
                    "article": {
                        "id":value.produit.article.id,
                        "nom":value.produit.article.nom,
                        "description":value.produit.article.description,
                        "unite":value.produit.article.unite,
                    },
                    "dateFabrication": value.produit.dateFabrication,
                    "dateExpiration": value.produit.dateExpiration,
                    "taxe": value.produit.taxe,
                    "filesList": filesListes,
                },
                "quantite": value.quantite,
                "montantTotal": value.montantTotal,
                "prixVente": value.produit.prixUnitaire+value.produit.gainUnitaire,
                "prixAchat": value.produit.prixUnitaire,

            });
        });

        const fact = {
            "reference": newFacture.reference,
            "date": this.datePipe.transform(newFacture.date, 'yyyy-MM-dd'),
            "montant": newFacture.montant+newFacture.montant*newFacture.montantTaxe/100,
            "paye": newFacture.paye,
            "reglement": newFacture.reglement,
            "montantTaxe": newFacture.montantTaxe,
            "typeFacture": newFacture.typeFacture,
            "lignesFacture": ligneFact,
            "client": {
                "id": newFacture.client.id
            },
            "transporteur": {
                "id": newFacture.transporteur.id
            },
            "provider": {
                "id": newFacture.provider.id
            },
            "depot": {
                "id": newFacture.depot.id
            },
            "tranches":newFacture.tranches.map(tr => ({
                "id": tr.id,
                "dateEcheance":tr.dateEcheance,
                "montantTranche": tr.montantTranche,
                "description": tr.description,
                "statutPayement": tr.statutPayement,
                'user':null,
            }))
        };

        console.log(fact);
        const url = `${this.api}/create`;
        return this.http.post<Facture>(url, fact, {headers});
    }

    getFactureById(id: number ):Observable <Facture>  {
        const token = getToken();
        const url = `${this.api}/findByid/${id}`;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
        return this.http.get<Facture>(url, {headers});  }

    searchFacture(term: string): Facture[] {
        term = term.toLowerCase();
        return this.factures.filter(facture =>
            facture.reference.toLowerCase().includes(term)
        );
    }

    getClient(id : number) :Observable<User> {
        const token = getToken();
        const url = `${this.api}/getClient/${id}`;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
        return this.http.get<User>(url, {headers});
    }
    updateFacture(newFacture: Facture): Observable<Facture> {
        const token = getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
        let filesListes:any[]=[];
        newFacture.lignesFacture.forEach((value) => {
            value.produit.files.forEach((file) => {
                filesListes.push({
                    "id": file.id,
                    "name":file.name,
                    "type":file.type,
                    "path":file.path
                });
            });
        });

        let ligneFact:any[]=[];
        newFacture.lignesFacture.forEach(value => {
            ligneFact.push(  {
                "produit": {
                    "id" :value.produit.id,
                    "qantite":value.produit.qantite,
                    "nom":value.produit.nom,
                    "prixUnitaire":value.produit.prixUnitaire,
                    "prixGros":value.produit.prixGros,
                    "description":value.produit.description,
                    "dataqr":value.produit.dataqr,
                    "gainUnitaire":value.produit.gainUnitaire,
                    "gainGros":value.produit.prixGros,
                    "minQuantiteGros":value.produit.minQuantiteGros,
                    "dateFabrication":value.produit.dateFabrication,
                    "dateExpiration":value.produit.dateExpiration,
                    "taxe":value.produit.taxe,
                    "filesList": filesListes,
                    "article": {
                        "id":value.produit.article.id,
                        "nom":value.produit.article.nom,
                        "description":value.produit.article.description,
                        "unite":value.produit.article.unite,
                    }
                },
                "quantite": value.quantite,
                "montantTotal": value.montantTotal,
                "prixVente": value.produit.prixUnitaire+value.produit.gainUnitaire,
                "prixAchat": value.produit.prixUnitaire,
                "id":value.id
            })
        })
        const fact ={
            "id":newFacture.id,
            "reference": newFacture.reference,
            "date":this.datePipe.transform(newFacture.date,'yyyy-MM-dd'),
            "montant": newFacture.montant+newFacture.montant*newFacture.montantTaxe/100,
            "paye": newFacture.paye,
            "reglement": newFacture.reglement,
            "montantTaxe": newFacture.montantTaxe,
            "typeFacture": newFacture.typeFacture,
            "lignesFacture": ligneFact,
            "client":{
                "id":newFacture.client.id
            },
            "transporteur":{
                "id":newFacture.transporteur.id
                // "role":newFacture.transporteur.role
            },
            "provider":{
                "id":newFacture.provider.id
            },
            "depot":{
                "id":newFacture.depot.id
            },
            "tranches":newFacture.tranches.map(tr => ({
                "id": tr.id,
                "dateEcheance":tr.dateEcheance,
                "montantTranche": tr.montantTranche,
                "description": tr.description,
                'user':null,
            }))
        };
        console.log("data :"+new JsonPipe().transform(fact));
        const url = `${this.api}/update`;
        return this.http.put<Facture>(url, fact, { headers });
    }

    deleteFacture(id: number): Observable<boolean> {
        const token = getToken();
        const url = `${this.api}/deleteFacture/${id}`;
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json; charset=utf-8');

        return this.http.delete(url, { headers })
            .pipe(
                map(() => true),  // Transform the response to true
                catchError(error => {
                    console.error('Error deleting facture:', error);
                    return of(false); // Return false in case of an error
                })
            );
    }
   /* returnBack() {
        this.confirmationService.confirm({
            header: 'Êtes-vous sûr?',
            message: 'Vous ne pourrez pas revenir en arrière !',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-outlined p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined p-button-secondary',
            accept: () => {
                this.router.navigate(['/uikit/facture']);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Annulation',
                    detail: 'Le retour a été annulé.'
                });
            }
        });
    }*/

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
                this.router.navigate(['/uikit/facture']);
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

