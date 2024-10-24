import { Injectable } from '@angular/core';
import {FactureVente} from "../../models/FactureVente";
import {Depot} from "../../models/Depot";
import {environment} from "../../../environments/environment";
import {DepotService} from "./depot.service";
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfirmationService, MessageService} from "primeng/api";
import {ProduitService} from "./produit.service";
import {TrancheService} from "./tranche.service";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {Observable} from "rxjs";
import {getToken, getUserDecodeID} from "../../../main";
import {Page} from "../../models/Page";
import {Facture, factureType} from "../../models/Facture";
import {User} from "../../models/user";
import Swal from "sweetalert2";
import {FactureAchat} from "../../models/FactureAchat";

@Injectable({
  providedIn: 'root'
})
export class FactureAchatService {

  factures: FactureAchat[] = []; // Initialisation du tableau de FactureAchats
  // @ts-ignore
  depots: Depot[] = this.getAllDepots();
  private api =environment.apiUrl+'/factureAchat';
  private apiP =environment.apiUrl+'/produit';
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

    });
  }
  getFactures(): Observable<any> {
    const token = getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
      return this.http.get<FactureAchat[]>(this.api + '/readDto', {headers});

    }else {
      return  new Observable<FactureAchat[]>() ;
    }
  }

  LoadFactures(page: number, size: number): Observable<Page<FactureAchat>> {
    const url = `${this.api}/DtoReadPage?page=${page}&size=${size}`;
    const token = getToken();

    if (token) {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get<Page<FactureAchat>>(url, { headers });
    } else {
      return new Observable();
    }
  }


  getTypesFacture(): string[] {
    const typeKeys = Object.keys(factureType) as Array<keyof typeof factureType>;
    return typeKeys.map(key => factureType[key]);
  }



  addFacture(newFacture: FactureAchat): Observable<FactureAchat> {
    const token = getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.api}/create`;
    return this.http.post<FactureAchat>(url, newFacture, {headers});
  }

  getFactureById(id: number ):Observable <FactureAchat>  {
    const token = getToken();
    const url = `${this.api}/findByid/${id}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
    return this.http.get<FactureAchat>(url, {headers});  }

  searchFacture(term: string): FactureAchat[] {
    term = term.toLowerCase();
    return this.factures.filter(factureAchat =>
        factureAchat.reference.toLowerCase().includes(term)
    );
  }

  getClient(id : number) :Observable<User> {
    const token = getToken();
    const url = `${this.api}/getClient/${id}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
    return this.http.get<User>(url, {headers});
  }
  updateFacture(newFacture: FactureAchat): Observable<FactureAchat> {
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
          "gainGros":value.produit.gainGros,
          "minQuantiteGros":value.produit.minQuantiteGros,
          "historiques": value.produit.historiques.map(value1 => ({
            "id": value1.id,
            "prixHistoriqueAchat": value1.prixHistoriqueAchat,
            "quantiteHistoriqueAchat": value1.quantiteHistoriqueAchat,
            "dateMisAjoure": value1.dateMisAjoure,
            "idFactRefToHist": value1.idFactRefToHist,
          })),
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
        "prixVente": value.prixVente,
        "prixAchat": value.prixAchat,
        "typeCalcule": value.typeCalcule,
        "idHistorique": value.idHistorique,
      })
    })
    const fact={
      "id":newFacture.id,
      "reference": newFacture.reference,
      "date":this.datePipe.transform(newFacture.date,'yyyy-MM-dd'),
      "montant": newFacture.montant,
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
      "depot":newFacture.typeFacture==factureType.ENTREE?{"id":newFacture.depot.id }:null,
      "tranches":newFacture.tranches.map(tr => ({
        "id": tr.id,
        "dateEcheance":tr.dateEcheance,
        "montantTranche": tr.montantTranche,
        "description": tr.description,
        'user':null,
      }))
    };

    console.log(newFacture)
    const url = `${this.api}/update`;
    return this.http.put<FactureAchat>(url, newFacture, { headers });
  }

  deleteFacture(id: number): Observable<boolean> {
    const token = getToken();
    const url = `${this.api}/deleteFacture/${id}`;
    const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json; charset=utf-8');

    return this.http.delete<boolean>(url, { headers })

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
        this.router.navigate(['/uikit/factureAchat']);
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

      })
    }else {
      this.permission =false ;
    }
  }

  removeFactureWithUpdateProduct(newFacture: FactureAchat): Observable<FactureAchat> {
    const token = getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.info(newFacture)
    const url = `${this.api}/removeFactWithUpdate`;
    return this.http.put<FactureAchat>(url, newFacture, { headers });
  }

}
