import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CommandeServ} from "../../models/CommandeServ ";
import {getToken} from "../../../main";
import {throwError} from "rxjs/internal/observable/throwError";
import {catchError} from "rxjs/internal/operators/catchError";
import {Facture} from "../../models/Facture";
import {DatePipe} from "@angular/common";
import {LigneVente} from "../../models/LigneVente";

@Injectable({
  providedIn: 'root'
})
export class CommandeServiceService {
private newCommande : CommandeServ;
  private api = `${environment.apiUrl}/commandes`;

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {}


  getAllCommandes(): Observable<CommandeServ[]> {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      // Ajouter le token à l'en-tête de la requête
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json; charset=utf8');

      return this.http.get<CommandeServ[]>(this.api, { headers });
    } else {
      return new Observable<CommandeServ[]>();
    }
  }
  getCommandeById(id: number): Observable<CommandeServ> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${getToken()}`);
    return this.http.get<CommandeServ>(`${this.api}/${id}`, { headers });
  }



  addCommande(c: CommandeServ): Observable<CommandeServ> {
    const token = getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const filesListes = c.produits.flatMap(value =>
        value.produit.files.map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          path: file.path
        }))
    );

    const lignecommande = c.produits.map(value => ({
      produit: {
        id: value.produit.id,
        qantite: value.produit.qantite,
        nom: value.produit.nom,
        prixUnitaire: value.produit.prixUnitaire,
        prixGros: value.produit.prixGros,
        description: value.produit.description,
        dataqr: value.produit.dataqr,
        gainUnitaire: value.produit.gainUnitaire,
        gainGros: value.produit.gainGros,
        minQuantiteGros: value.produit.minQuantiteGros,
        article: {
          id: value.produit.article.id,
          nom: value.produit.article.nom,
          description: value.produit.article.description,
          unite: value.produit.article.unite
        },
        dateFabrication: value.produit.dateFabrication,
        dateExpiration: value.produit.dateExpiration,
        taxe: value.produit.taxe,
        filesList: filesListes
      },
      qtyV: value.qtyV,
      montantTotal: value.prixVente,
      prixVente: value.produit.prixUnitaire + value.produit.gainUnitaire,
      prixAchat: value.produit.prixUnitaire
    }));

    const commande = {
      dateCreation: this.datePipe.transform(c.dateCreation, 'yyyy-MM-dd'),
      dateValidationOuSortie: this.datePipe.transform(c.dateValidationOuSortie, 'yyyy-MM-dd'),
      dateEstimeeFin: this.datePipe.transform(c.dateEstimeeFin, 'yyyy-MM-dd'),
      reference : c.reference,
      paiement: c.paiement,
      status: c.status,
      avance: c.avance,
      prixSupplimentaire: c.prixSupplimentaire,
      totalCoutService: c.totalCoutService,
      totalProduits: c.totalProduits,
      prixTotal: c.prixTotal,
      produits: lignecommande,
      nomPanne: c.nomPanne,
      descriptionPanne: c.descriptionPanne,
      descriptionprixSupplimentaire: c.descriptionprixSupplimentaire,
      client: {
        id: c.client.id,
        role: c.client.role
      },
      services: c.services.map(service => ({
        id: service.id,
        description: service.descriptionServiceComp
      }))
    };

    console.log("Commande envoyée:", commande);
    return this.http.post<CommandeServ>(this.api, commande, { headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout de la commande:', error);
          return throwError(() => new Error('Une erreur est survenue lors de l\'ajout de la commande.'));
        })
    );
  }
  updateCommande(c: CommandeServ): Observable<CommandeServ> {
    const token = getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const filesListes = c.produits.flatMap(value =>
        value.produit.files.map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          path: file.path
        }))
    );

    const lignecommande = c.produits.map(value => ({
      produit: {
        id: value.produit.id,
        qantite: value.produit.qantite,
        nom: value.produit.nom,
        prixUnitaire: value.produit.prixUnitaire,
        prixGros: value.produit.prixGros,
        description: value.produit.description,
        dataqr: value.produit.dataqr,
        gainUnitaire: value.produit.gainUnitaire,
        gainGros: value.produit.gainGros,
        minQuantiteGros: value.produit.minQuantiteGros,
        article: {
          id: value.produit.article.id,
          nom: value.produit.article.nom,
          description: value.produit.article.description,
          unite: value.produit.article.unite
        },
        dateFabrication: value.produit.dateFabrication,
        dateExpiration: value.produit.dateExpiration,
        taxe: value.produit.taxe,
        filesList: filesListes
      },
      qtyV: value.qtyV,
      montantTotal: value.prixVente,
      prixVente: value.produit.prixUnitaire + value.produit.gainUnitaire,
      prixAchat: value.produit.prixUnitaire
    }));

    const commande = {
      dateCreation: this.datePipe.transform(c.dateCreation, 'yyyy-MM-dd'),
      dateValidationOuSortie: this.datePipe.transform(c.dateValidationOuSortie, 'yyyy-MM-dd'),
      dateEstimeeFin: this.datePipe.transform(c.dateEstimeeFin, 'yyyy-MM-dd'),
      paiement: c.paiement,
      reference : c.reference,
      status: c.status,
      avance: c.avance,
      prixSupplimentaire: c.prixSupplimentaire,
      totalCoutService: c.totalCoutService,
      totalProduits: c.totalProduits,
      prixTotal: c.prixTotal,
      produits: lignecommande,
      nomPanne: c.nomPanne,
      descriptionPanne: c.descriptionPanne,
      descriptionprixSupplimentaire: c.descriptionprixSupplimentaire,
      client: {
        id: c.client.id,
        role: c.client.role
      },
      services: c.services.map(service => ({
        id: service.id,
        description: service.descriptionServiceComp
      }))
    };
    console.log("Commande mise à jour:", commande);
    return this.http.put<CommandeServ>(`${this.api}/${c.id}`, commande, { headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour de la commande:', error);
          return throwError(() => new Error('Une erreur est survenue lors de la mise à jour de la commande.'));
        })
    );
  }


  deleteCommande(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${getToken()}`);
    return this.http.delete<void>(`${this.api}/${id}`, { headers });
  }
}