import { Injectable } from '@angular/core';
import {Facture, factureType} from "../../models/Facture";
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
import {User} from "../../models/user";
import Swal from "sweetalert2";
import {FactureVente} from "../../models/FactureVente";

@Injectable({
  providedIn: 'root'
})
export class FactureVenteService {

  factures: FactureVente[] = []; // Initialisation du tableau de FactureVentes
  // @ts-ignore
  depots: Depot[] = this.getAllDepots();
  private api =environment.apiUrl+'/factureVente';
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
      return this.http.get<FactureVente[]>(this.api + '/readDto', {headers});

    }else {
      return  new Observable<FactureVente[]>() ;
    }
  }

  LoadFactures(page: number, size: number): Observable<Page<FactureVente>> {
    const url = `${this.api}/DtoReadPage?page=${page}&size=${size}`;
    const token = getToken();

    if (token) {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get<Page<FactureVente>>(url, { headers });
    } else {
      return new Observable();
    }
  }


  getTypesFacture(): string[] {
    const typeKeys = Object.keys(factureType) as Array<keyof typeof factureType>;
    return typeKeys.map(key => factureType[key]);
  }



  addFacture(newFacture: FactureVente): Observable<FactureVente> {
    const token = getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });



    const url = `${this.api}/create`;
    return this.http.post<FactureVente>(url, newFacture, {headers});
  }

  getFactureById(id: number ):Observable <Facture>  {
    const token = getToken();
    const url = `${this.api}/findByid/${id}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
    return this.http.get<FactureVente>(url, {headers});  }

  searchFacture(term: string): Facture[] {
    term = term.toLowerCase();
    return this.factures.filter(FactureVente =>
        FactureVente.reference.toLowerCase().includes(term)
    );
  }

  getClient(id : number) :Observable<User> {
    const token = getToken();
    const url = `${this.api}/getClient/${id}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set("Content-Type", "application/json; charset=utf8");
    return this.http.get<User>(url, {headers});
  }
  updateFacture(newFacture: FactureVente): Observable<FactureVente> {
    const token = getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.api}/update`;
    return this.http.put<FactureVente>(url, newFacture, { headers });
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
        this.router.navigate(['/uikit/factureVente']);
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

  removeFactureWithUpdateProduct(newFacture: FactureVente): Observable<FactureVente> {
    const token = getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.info(newFacture)
    const url = `${this.api}/removeFactWithUpdate`;
    return this.http.put<FactureVente>(url, newFacture, { headers });
  }

}
