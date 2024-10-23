import {Injectable, Provider} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {getToken} from "../../../main";
import {Vente} from "../../models/Vente";
import {throwError} from "rxjs/internal/observable/throwError";
import {catchError} from "rxjs";
import {JsonPipe} from "@angular/common";
import {Facture} from "../../models/Facture";
import {LigneFacture} from "../../models/LigneFacture";
import {Client} from "../../models/client";
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class VenteService {
    private api =environment.apiUrl+'/vente';
    public show: boolean = false;
    private apiFact=environment.apiUrl+'/factureVente';


    constructor(private http: HttpClient) {
    }

    getVentes(): Observable<Vente[]> {
        const url = `${this.api}/read`;

        // Récupérer le token d'authentification depuis le stockage local (à adapter selon votre méthode d'authentification)
        const token = getToken();

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

    transferFacturation(listVente: Vente[]) {
        const url = `${this.apiFact}/convertVenteToFactureVente`;
        const token = getToken(); // Assurez-vous que getToken() est une fonction qui récupère le token JWT

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json; charset=utf8');

        return this.http.post<any>(url, listVente, { headers }).pipe(
            catchError((error) => {
                console.error('Erreur lors du transfert de facturation', error);
                return throwError(() => new Error('Une erreur est survenue lors du transfert de facturation.'));
            })
        );


    }



    // async convertVenteToFacture(ventes: Vente[]): Promise<Facture[]> {
    //     console.log(ventes);
    //     const factures: Facture[] = [];
    //
    //     for (const vente of ventes) {
    //         const facture = new Facture();
    //
    //         if (facture.reference.trim() === '') {
    //             facture.reference = this.genererReferenceFacture();
    //         }
    //
    //         // Vérification des lignes de vente
    //         if (vente.lignesVente.length > 0) {
    //             // Validation du client pour une facture de vente
    //             if (vente.client) {
    //                 try {
    //                     const client = await .getUserById(vente.client.id);
    //                     if (!client) {
    //                         throw new Error('Client not found');
    //                     }
    //                     facture.client = client;
    //
    //                     const user = await this.providerRepository.findByEmailSociete(this.getDefaultEmailSociete());
    //                     if (!user) {
    //                         throw new Error('Provider not found');
    //                     }
    //                     facture.provider = user as Provider;
    //                     facture.typeFacture = 'FACTURE_VENTE';
    //                 } catch (error) {
    //                     console.error(error.message);
    //                 }
    //             }
    //
    //             // Ajoute de transporteur par défaut
    //             try {
    //                 const defaultTransporteur = await this.transporteurRepository.findTransporteurByEmail(this.getEmailTransporteur());
    //                 facture.transporteur = defaultTransporteur;
    //             } catch (error) {
    //                 console.error('Transporteur not found');
    //             }
    //
    //             // Depot par défaut
    //             try {
    //                 const depot = await this.depotRepository.findById(1);
    //                 if (!depot) {
    //                     throw new Error('Depot not found');
    //                 }
    //                 facture.depot = depot;
    //             } catch (error) {
    //                 console.error(error.message);
    //             }
    //
    //             // Gestion des lignes de facture
    //             const modifiedLignesFacture: LigneFacture[] = [];
    //             for (const ligne of vente.lignesVente) {
    //                 const produit = ligne.produit;
    //
    //                 // Préparation de nouvelle ligne facture associée à la ligne vente
    //                 const ligneFact = new LigneFacture();
    //                 ligneFact.produit = produit;
    //                 ligneFact.quantite = ligne.venteQty;
    //                 ligneFact.prixVente = ligne.prixVente;
    //                 ligneFact.typeCalcule = 'MoyenValue';
    //                 ligneFact.montantTotal = ligneFact.prixVente * ligneFact.quantite;
    //
    //                 // Simulate saving to repository
    //                 await this.ligneFactureRepository.save(ligneFact);
    //                 modifiedLignesFacture.push(ligneFact);
    //             }
    //             facture.lignesFacture = modifiedLignesFacture;
    //
    //             // Simulate saving to repository
    //             await this.factureRepository.save(facture);
    //             factures.push(facture);
    //         }
    //     }
    //
    //     return factures;
    // }

    genererReferenceFacture(): string {
        // Implémentation de la génération de référence de facture
        return 'REF' + Math.floor(Math.random() * 10000);
    }

    getDefaultEmailSociete(): string {
        // Implémentation pour obtenir l'email par défaut de la société
        return 'default@example.com';
    }

    getEmailTransporteur(): string {
        // Implémentation pour obtenir l'email du transporteur
        return 'transporteur@example.com';
    }

}
