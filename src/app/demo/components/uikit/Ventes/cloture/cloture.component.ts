import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {Table, TableModule} from "primeng/table";
import { ClotureService } from "../../../../../layout/service/cloture.service";
import { User } from "../../../../../models/user";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../../../../layout/service/user.service";
import Swal from "sweetalert2";
import { Vente } from "../../../../../models/Vente";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RippleModule } from "primeng/ripple";
import {Cloture} from "../../../../../models/Cloture";
import {Page} from "../../../../../models/Page";

@Component({
  selector: 'app-cloture',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    OverlayPanelModule,
    DialogModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RippleModule
  ],
  templateUrl: './cloture.component.html',
  styleUrls: ['./cloture.component.scss']
})
export class ClotureComponent implements OnInit {
  initTabCloture: Cloture[]=[];
  CloturesPage: Page<Cloture>={
    content:this.initTabCloture,number:0,size:0,totalPages:0,totalElements:0

  };
  currentPage: number = 0;
  pageSize: number = 10; // Nombre d'éléments par page
  loadingdata: boolean = false;
  first = 0;
  rows = 10;




  @ViewChild("opCloture") opCloture!: OverlayPanel;
  searchTerm: string = "";
  searchTermVente: string = "";
  clotures: Cloture[] = [];
  cloturesFiltrer: Cloture[] = [];
  listVente: Vente[] = [];
  loading: boolean = false;
  employer: User[] = [];
  userConnecte: User=new User();
  cloture!: Cloture;
  showTable: boolean = false;
  visible: boolean = false;

  constructor(
      private clotureService: ClotureService,
      public serviceuser: UserService,
      private route: ActivatedRoute,
      private router: Router,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClotures(this.currentPage, this.pageSize);

    this.getAllClotures();
  }



  refrech() {
    this.getAllClotures();
  }

  loadClotures(page: number, size: number) {
    this.loadingdata=true ;
    this.clotureService.LoadClotures(page, size).subscribe(
        (data: Page<Cloture>) => {
          this.CloturesPage = data;
          this.loadingdata=false;
        },
        (error) => {
          console.error('Erreur lors du chargement des Cloture', error);
        }
    );
  }


  onPageChange(event: any) {
    this.currentPage = event.page==undefined?0:event.page;
    this.pageSize = event.rows==undefined?10:event.rows
    this.loadClotures(this.currentPage, this.pageSize);

  }

  next() {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.loadClotures(this.currentPage, this.pageSize);
    }
  }

  prev() {
    if (!this.isFirstPage()) {
      this.currentPage--;
      this.loadClotures(this.currentPage, this.pageSize);

    }

  }


  reset() {
    this.currentPage = 0; // Réinitialise à la première page
    this.loadClotures(this.currentPage, 10);

  }

  pageChange(event) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isFirstPage() {
    return this.currentPage === 0;
  }

  isLastPage() {
    return (this.currentPage + 1) * this.pageSize >= this.clotures.length;
  }

  getAllClotures() {
    this.loading = true;
    this.clotureService.getClotures().subscribe(data => {
      this.clotures = data;
      this.loading = false;
      this.cdr.detectChanges(); // Trigger change detection

    });
  }

  getClotureById() {
    this.route.params.subscribe((params) => {
      const clotureId = params['id'];
      if (clotureId) {
        this.clotureService.getClotureById(clotureId).subscribe(
            (cloture) => {
              this.cloture = cloture;
              this.cdr.detectChanges(); // Trigger change detection
            },
            (error) => {
              console.error('Erreur lors de la récupération de la clôture :', error);
            }
        );
      }
    });
  }

  removeCloture(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous supprimer ce produit ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clotureService.deleteCloture(id).subscribe(
            (response: any) => {
              if (response) {
                this.getAllClotures();

                Swal.fire('Supprimé', response.message, 'success');
              } else {
                Swal.fire('Erreur', 'La suppression a réussi, mais aucun message de confirmation n\'a été reçu.', 'error');
              }
              this.cdr.detectChanges(); // Trigger change detection
            },
            (error) => {
              console.error('Erreur lors de la suppression :', error);
              Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression. Veuillez consulter la console pour plus d\'informations.', 'error');
            }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Annulé', 'La suppression a été annulée', 'info');
      }
    });
    this.reload();

  }

  public getEmployer(cloture: Cloture): Record<string, any> {
    const result: Record<string, any> = {};
    this.clotures.forEach((c) => {
      const user = JSON.stringify(c.employer);
    });
    result['lastname'] = cloture.employer.lastname;
    result['firstname'] = cloture.employer.firstname;
    return result;
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((<HTMLInputElement>event.target).value, 'contains');
  }

  public getDetailsCloture(cloture: Cloture) {
    this.clotureService.getCloturesFiltrer(cloture.id).subscribe(data => {
      this.listVente = data;
      this.loading = false;
      this.cdr.detectChanges(); // Trigger change detection
    });
  }

  public get(cloture: any, opCloture: OverlayPanel, $event: MouseEvent) {
    opCloture.toggle($event);
    this.getDetailsCloture(cloture);
    this.cdr.detectChanges(); // Trigger change detection

  }

  showDialog() {
    this.visible = true;
    this.cdr.detectChanges(); // Trigger change detection
  }

  private reload() {
    this.router.navigate(['/uikit/cloture']); // Redirection vers la page de modification avec l'ID du produit

  }
}




