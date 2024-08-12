import {Component, OnInit} from '@angular/core';
import {CommandeServ} from "../../../../../models/CommandeServ ";
import {CommandeServiceService} from "../../../../../layout/service/commande-service.service";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {DatePipe, NgIf} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {getToken} from "../../../../../../main";
import {Observable} from "rxjs/internal/Observable";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-commande-service',
  standalone: true,
  imports: [
    AvatarModule,
    BadgeModule,
    ButtonModule,
    InputTextModule,
    NgIf,
    RippleModule,
    SharedModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    DatePipe,
    ConfirmDialogModule
  ],
  templateUrl: './commande-service.component.html',
  styleUrl: './commande-service.component.scss'
})
export class CommandeServiceComponent implements OnInit{
  commandes: CommandeServ[] = [];
  statuses: any[] = [{ label: 'En cours', value: 'ENCOURS' }, { label: 'Retour', value: 'RETOUR' }, { label: 'Confirmé', value: 'CONFIRME' }];

  constructor(private commandesService : CommandeServiceService,
              private router : Router,
              private confirmationService : ConfirmationService,
              private messageService: MessageService) {
  }
  ngOnInit(): void {
    this.getCommandes();

  }
  getCommandes(): void {
    this.commandesService.getAllCommandes().subscribe(
        (data: CommandeServ[]) => {
          this.commandes = data;
          console.table(this.commandes)

        },
        (error) => {
          console.error('Erreur lors de la récupération des commandes', error);
        }
    );
  }
  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette commande ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteCommande(id); // Appeler la méthode de suppression si accepté
      },
      reject: () => {
        // Optionnel : Gérer le rejet si nécessaire
      }
    });
  }

  deleteCommande(id: number): void {
    this.commandesService.deleteCommande(id).subscribe({
      next: () => {
        // Réussi : Supprimer l'élément de la liste
        this.commandes = this.commandes.filter(commande => commande.id !== id);
        // Afficher une notification
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Commande supprimée avec succès!' });
      },
      error: (err) => {
        // Gérer l'erreur
        console.error('Erreur lors de la suppression de la commande:', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression de la commande.' });
      }
    });
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  editCommande(commande: any) {
    
  }


  refresh() {
    this.getCommandes()
  }

  ajouterCommandeService() {
    this.router.navigate(['/uikit/Ajout-Commande']);
  }
}
