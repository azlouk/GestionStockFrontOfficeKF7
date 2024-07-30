import {Component, OnInit, ViewChild} from '@angular/core';
import {Facture, FactureInterface} from "../../../../../models/Facture";
import {User} from "../../../../../models/user";
import {Produit} from "../../../../../models/produit";
import {FactureService} from "../../../../../layout/service/facture.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgClass, NgIf} from "@angular/common";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {Ripple, RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {SliderModule} from "primeng/slider";
import {TagModule} from "primeng/tag";
import {MultiSelectModule} from "primeng/multiselect";
import {SplitButtonModule} from "primeng/splitbutton";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-facture',
  standalone: true,
    imports: [
        AvatarModule,
        BadgeModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        TableModule,
        ToolbarModule,
        SliderModule,
        TagModule,
        MultiSelectModule,
        SplitButtonModule,
        NgClass,
        RippleModule,
        ToastModule,
        ConfirmDialogModule
    ],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.scss'
})
export class FactureComponent implements OnInit{

    @ViewChild('dt2') table: Table;
    montantFiltreCalcule: boolean = false;
    totalMontantFiltre: number = 0;
    statuses!: any[];
    loading: boolean = true;
    activityValues: number[] = [0, 100];
    root : string | undefined;
    factures: Facture[] = [];
    Facturefilred : FactureInterface[]=[];
    client : User = new User();
    searchTerm: string = '';
    produit :Produit[]=[];
    facture : Facture[] = [];
    idp?: number;
    idf?:number ;
    idd?:number;

    rechercheFacture: string = '';

    public selectedFacture: Boolean;
    constructor(
        public factureService: FactureService,
        private router:Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public  activatedRoute : ActivatedRoute){}

    ngOnInit(): void {
        this.getAllFactures();
        this.root = this.router.url.split('/')[1];
        const idpParam = <string> this.activatedRoute.snapshot.paramMap.get('idp')
        const iddParam = <string> this.activatedRoute.snapshot.paramMap.get('idd')
        if (idpParam !== null) {
            this.idp = +idpParam;
        }
        if (iddParam !== null) {
            this.idd = +iddParam;
        }
    }
    getClient(id: number): User {
        this.factureService.getClient(id).subscribe((value: User) => {
            this.client = value;
        });
        return this.client;
    }
    clear(table: Table) {
        table.clear();
        this.montantFiltreCalcule = false;

    }
    getAllFactures() {
        this.loading = true;
        this.factureService.getFactures().subscribe((value: FactureInterface[]) => {
            this.factureService.FactureInter=value
            this.loading=false;
            this.Facturefilred=value
            console.log('List of factures:', value);
        });
    }

    goToFactureDetails(id: number): void {
        this.router.navigate(['uikit/facture/', id]);
    }
    editFacture(id:number){
        this.router.navigate(['uikit/update-facture/', id]) ;
    }

    addFacture(){
        this.router.navigate(['/uikit/add-facture']);
    }
    onSearch(): void {
        if (this.searchTerm.trim() !== '') {
            this.factures = this.factureService.searchFacture(this.searchTerm.toLowerCase());
        } else {
            this.getAllFactures();
        }
    }

    selectFacture(facture: Facture) {
        this.idf = facture.id;
        console.log('idf:' ,this.idf)
        this.router.navigate(['/ajout-service/',this.idp,this.idf,this.idd]);
    }
    getPayeLabel(paye: boolean): string {
        return paye ? 'Oui' : 'Non';
    }
    getSeverity(status: boolean) {
        switch (status) {
            case true:
                return 'success';
            case false:
                return 'danger';
        }
    }

    getFilter(rechercheFacture: string) : string {
        if (rechercheFacture.toLowerCase()==='oui')
            return 'true';
        else if (rechercheFacture.toLowerCase()==='non')
            return 'false'
        else return rechercheFacture
    }

    refrech() {
        this.getAllFactures();
    }
    deleteFacture(id: number): void {
        this.confirmationService.confirm({
            header: "Êtes-vous sûr ?",
            message: "Vous ne pourrez pas revenir en arrière !",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Oui, supprimer",
            rejectLabel: "Annuler",
            acceptButtonStyleClass: 'p-button-outlined p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined p-button-primary',
            accept: () => {
                this.factureService.deleteFacture(id).subscribe(
                    (response) => {
                        console.log('Facture supprimée avec succès:', response);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Supprimée',
                            detail: 'Votre facture a été supprimée avec succès!'
                        });
                        this.getAllFactures();
                    },
                    (error) => {
                        console.error('Erreur lors de la suppression de la facture:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Une erreur est survenue lors de la suppression de la facture.'
                        });
                    }
                );
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Annuler!',
                    detail: 'La supprission de facture est annuler!'
                });
                this.getAllFactures();
            }
        });
    }
    public AjouterFcture() {

    }

    public deleteSelectedFacture() {

    }

    CalculeMontantFiltrer() {
        const filteredFactures = this.table.filteredValue || this.Facturefilred;
        this.totalMontantFiltre = filteredFactures.reduce((acc, facture) => acc + facture.montant, 0);
        this.montantFiltreCalcule = true;
    }


}

