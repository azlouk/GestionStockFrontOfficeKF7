import {Component, OnInit} from '@angular/core';
import {Depot} from "../../../../../models/Depot";
import {ActivatedRoute, Router} from "@angular/router";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import Swal from "sweetalert2";
import {User} from "../../../../../models/user";
import {DepotService} from "../../../../../layout/service/depot.service";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {Article} from "../../../../../models/Article";

@Component({
  selector: 'app-depot',
  standalone: true,
    imports: [
        AvatarModule,
        BadgeModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        RippleModule,
        SharedModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        NgClass,
        NgForOf
    ],
  templateUrl: './depot.component.html',
  styleUrl: './depot.component.scss'
})
export class DepotComponent implements OnInit{


    public isUpdate :boolean=false;
    root : string;
    depot:Depot = new Depot();
    depots : Depot [] = [];
    searchTerm: string = '';
    idp: string= '';
    idf:string ='';
    idd:number =0;
    viewCardviewTable : boolean =false ;
    displayusers: boolean=true;
    public submitted: boolean = false;

    public depotDialog: boolean = false;
    selectedDepots: Depot [] = [];
    public listReponsable: User[] = [] ;
    SelectedResponsable: User;
    SelectedResponsableId:number =0 ;

    constructor(public depotService: DepotService,
                private router:Router,
                private  activatedRoute: ActivatedRoute) {
        this.root = this.router.url.split('/')[1];
        this.displayusers=true;
    }

    ngOnInit(): void {
      this.getAllDepots();

        this.depotService.exist("depot");

        this.getDataResponsable()

    }

    getAllDepots() {
        this.depotService.getdepots().subscribe((value: Depot[]) => {
            this.depots = value;
            this.depotService.depots=value ;
        }, error => {
            // RedirectToLogin(this.router) ;

            this.displayusers=false;
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vous n'avez pas la permission s'il vous plait  contacter l'administrateur.  ",

            })
        });
    }

    getDataResponsable(){
        this.depotService.getAvailableResponsable().subscribe((value :User[])=>{
            this.listReponsable=value
        })
    }

    onSearch(): void {
        // Utilisez la méthode de recherche pour filtrer les dépôts
        this.depots = this.depotService.depots.filter(depot =>
            depot.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||depot.description.toLowerCase().includes(this.searchTerm.toLowerCase()) || depot.capitale.toString().includes(this.searchTerm.toLowerCase())
        );
    }

    goToDepotDetails(id: number): void {
        this.router.navigate(['/depot/edit', id]);
    }


    selectDepot(depot : Depot) {
        this.idd = depot.id;
        this.router.navigate(['/ajout-service/',this.idp,this.idf,this.idd]);
    }

    removeDepot(id: number) {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Voulez-vous supprimer ce Depot ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                this.depotService.deleteDepot(id).subscribe(
                    (response: any) => {
                        this.refrech();
                        if (response) {
                            this.refrech();0
                            Swal.fire('Supprimé', response.message, 'success');
                        } else {
                            Swal.fire('Erreur', 'La suppression a réussi, mais aucun message de confirmation n\'a été reçu.', 'error');
                        }
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


    }

    ChangeView() {
        this.viewCardviewTable=!this.viewCardviewTable;
    }

    ViewDetailResponsable(responsable: User) {

        Swal.fire({
            width:900,
            html: '<div class="cardResponsable p-1">\n' +
                '        <button class="mail">\n' +
                '           \n' +
                '        </button>\n' +
                '        <div class="profile-pic shadow-lg">\n' +
                '            \n' +'<img src="../../assets/hacker.png">'+
                '         \n' +
                '        </div>\n' +
                '        <div class="bottom">\n' +
                '            <div class="content">\n' +
                '                <span class="name text-break">'+responsable.lastname+'  '+responsable.firstname+'</span>\n' +
                '                <span class="about-me">'+responsable.email+' </span>\n' +
                '            </div>\n' +
                '           <div class="bottom-bottom">\n' +
                '            <div class="social-links-container">\n' +
                '                <span class="name text-break">'+responsable.lastname+'  '+responsable.firstname+'</span>\n' +
                '                <span class="about-me text-break">'+responsable.telephone+' </span>\n' +
                '            </div>\n' +
                '                      <span class="about-me bi-person text-danger">'+responsable.role.toLowerCase()+' </span>  ' +
                '           </div>\n' +
                '        </div>\n' +
                '    </div>',
            showConfirmButton:false,
            showCloseButton:true


        });


    }

    refrech() {
        this.getAllDepots();
        this.getDataResponsable();
        this.router.navigate(['/uikit/depots']);
    }

    showDialogCreate() {
        this.depotDialog = true;
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    public hideDialog() {
        this.depotDialog = false;
        this.refrech();

    }

    public deleteSelectedAricles() {

    }

    ajouterDepot() {
        if (this.depot.nom) {
            this.depotService.addDepot(this.depot).subscribe(value => {
                Swal.fire('Succès', 'Le dêpot a été ajouté avec succès !', 'success');
                this.refrech();
            }); // Ajout du produit via le service
            this.depot = new Depot(0,'', '', 0, 0, ''); // Réinitialisation du formulaire après l'ajout

            if (Response) {
                this.refrech();
            }
        } else {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs', 'error');


        }
        this.hideDialog();
        this.getAllDepots();

    }


    public editDepot(depot: any) {
        this.depotDialog=true
        this.depot = depot;
        this.refrech();

    }
}
