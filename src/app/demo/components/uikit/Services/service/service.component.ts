import {Component, OnInit} from '@angular/core';
import {ServiceCompService} from "../../../../../layout/service/service-comp.service";
import {CurrencyPipe, JsonPipe, NgIf} from "@angular/common";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {ButtonModule} from "primeng/button";
import {GalleriaModule} from "primeng/galleria";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {Table, TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {Router} from "@angular/router";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ServiceComp} from "../../../../../models/ServiceComp";

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    AvatarModule,
    BadgeModule,
    ButtonModule,
    CurrencyPipe,
    GalleriaModule,
    InputTextModule,
    NgIf,
    RippleModule,
    SharedModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule
  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent implements OnInit{
  services : ServiceComp[] = [];
  loading=true
  displayusers = true;
  constructor(public serviceCompService: ServiceCompService,
              private router: Router,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }
  ngOnInit(): void {
    this.getAllServices()
  }

  getAllServices(): void {
    this.loading = true;
    this.serviceCompService.getServices().subscribe(
        (services: ServiceComp[]) => {
          this.services = services;
          this.loading = false;
          //this.calculerCout();
          console.table(services);
        },
        (error: any) => {
          console.error('Error fetching services:', error);
          this.loading = false;
         // this.displayusers = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Oops...',
            detail: "Vous n'avez pas la permission, s'il vous plaît contactez l'administrateur."
          });
        }
    );
  }


  newService() {
    this.router.navigate(['/uikit/ajout-service']);
  }

  refresh() {

  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  modifierService(service: ServiceComp) {
      this.router.navigate(['/uikit/edit-service', service.id]); // Redirection vers la page de modification avec l'ID du produit
    }

  supprimerService(serviceId: number): void {
    this.confirmationService.confirm({
      message: 'Voulez-vous supprimer cet utilisateur ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Oui, supprimer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.serviceCompService.deleteService(serviceId).subscribe(
            (response: boolean) => {
              if (response) {
                this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Le service a été supprimé avec succès!' });
                this.getAllServices();
              }
            },
            (error) => {
              console.error('Erreur lors de la suppression :', error);
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la suppression. Veuillez consulter la console pour plus d\'informations.' });
            }
        );
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Annulé', detail: 'La suppression a été annulée' });
      }
    });
  }
}
