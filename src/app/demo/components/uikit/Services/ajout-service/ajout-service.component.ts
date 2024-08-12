import {Component, OnInit} from '@angular/core';
import {ServiceCompService} from "../../../../../layout/service/service-comp.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {User} from "../../../../../models/user";
import {FormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {UserService} from "../../../../../layout/service/user.service";
import {DialogModule} from "primeng/dialog";
import {InputNumberModule} from "primeng/inputnumber";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {CardModule} from "primeng/card";
import {Depot} from "../../../../../models/Depot";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {DepotService} from "../../../../../layout/service/depot.service";
import {FactureService} from "../../../../../layout/service/facture.service";
import {TableModule} from "primeng/table";
import {ToggleButtonModule} from "primeng/togglebutton";
import {DropdownModule} from "primeng/dropdown";
import {ServiceComp} from "../../../../../models/ServiceComp";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {FileUploadModule} from "primeng/fileupload";
import {GenerationcodeComponent} from "../../../utilities/generationcode/generationcode.component";
import {GenerationqrComponent} from "../../../utilities/generationqr/generationqr.component";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgForOf, NgIf} from "@angular/common";
import {NgxBarcode6Module} from "ngx-barcode6";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {MultiSelectModule} from "primeng/multiselect";
import {RadioButtonModule} from "primeng/radiobutton";
import {FieldsetModule} from "primeng/fieldset";
import {Produit} from "../../../../../models/produit";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ajout-service',
  standalone: true,
  imports: [
    FormsModule,
    SelectButtonModule,
    DialogModule,
    InputNumberModule,
    CalendarModule,
    CheckboxModule,
    CardModule,
    TableModule,
    ToggleButtonModule,
    DropdownModule,
    ConfirmDialogModule,
    FileUploadModule,
    GenerationcodeComponent,
    GenerationqrComponent,
    InputTextModule,
    InputTextareaModule,
    NgForOf,
    NgIf,
    NgxBarcode6Module,
    RippleModule,
    ToastModule,
    MultiSelectModule,
    RadioButtonModule,
    FieldsetModule
  ],
  templateUrl: './ajout-service.component.html',
  styleUrl: './ajout-service.component.scss'
})
export class AjoutServiceComponent  implements OnInit {
  newService: ServiceComp = new ServiceComp();
  users: User[] = [];
  serviceId: number | undefined;

  constructor(
      private serviceService: ServiceCompService,
      private userService: UserService,
      private route: ActivatedRoute,
      private router: Router,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.route.params.subscribe(params => {
      this.serviceId = +params['id'];
      if (this.serviceId) {
        this.loadService();
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadService(): void {
    if (this.serviceId) {
      this.serviceService.getServiceById(this.serviceId).subscribe(
          service => {
            this.newService = service;
          },
          error => {
            console.error('Erreur lors du chargement du service :', error);
          }
      );
    }
  }

  ajouterService(): void {
    if (this.newService.id) {
      this.serviceService.updateService(this.newService).subscribe(
          response => {
            this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Service mis à jour avec succès'});
            this.router.navigate(['/uikit/services']);
          },
          error => {
            console.error('Erreur lors de la mise à jour du service :', error);
            this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour du service'});
          }
      );
    } else {
      this.serviceService.addService(this.newService).subscribe(
          response => {
            this.confirmationService.confirm({
              message: 'Service ajouté avec succès. Voulez-vous consulter la liste des services ?',
              accept: () => {
                this.router.navigate(['/uikit/services']);
              },
              reject: () => {
                this.newService = new ServiceComp(); // Réinitialisation après l'ajout
              }
            });
          },
          error => {
            console.error('Erreur lors de l\'ajout du service :', error);
            this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'ajout du service'});
          }
      );
    }
  }

  returnBack() {
    this.router.navigate(['/uikit/services']);
  }
}