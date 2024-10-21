import {Component, OnInit, ViewChild} from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {FieldsetModule} from "primeng/fieldset";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {RippleModule} from "primeng/ripple";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {Table, TableModule, TableRowCollapseEvent, TableRowExpandEvent} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {TriStateCheckboxModule} from "primeng/tristatecheckbox";
import {Facture, factureType} from "../../../../../models/Facture";
import {Page} from "../../../../../models/Page";
import {User} from "../../../../../models/user";
import {Produit} from "../../../../../models/produit";
import {FactureService} from "../../../../../layout/service/facture.service";
import {UserService} from "../../../../../layout/service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {LigneFacture} from "../../../../../models/LigneFacture";
import {Historique} from "../../../../../models/historique";
import {Tranche} from "../../../../../models/Tranche";
import {FactureVente} from "../../../../../models/FactureVente";
import {FactureVenteService} from "../../../../../layout/service/facture-vente.service";

@Component({
  selector: 'app-facture-vente',
  standalone: true,
    imports: [
        AvatarModule,
        BadgeModule,
        ButtonModule,
        CheckboxModule,
        ConfirmDialogModule,
        CurrencyPipe,
        DatePipe,
        DecimalPipe,
        DialogModule,
        FieldsetModule,
        FormsModule,
        InputTextModule,
        NgIf,
        OverlayPanelModule,
        RippleModule,
        SharedModule,
        TableModule,
        TagModule,
        ToastModule,
        ToolbarModule,
        TriStateCheckboxModule,
        NgClass
    ],
  templateUrl: './facture-vente.component.html',
  styleUrl: './facture-vente.component.scss'
})
export class FactureVenteComponent implements OnInit{

    initTabFacture: FactureVente[]=[];
    facturesPage: Page<FactureVente>={
        content:this.initTabFacture,number:0,size:0,totalPages:0,totalElements:0

    };
    currentPage: number = 0;
    pageSize: number = 10; //
    loadingdata: boolean = false;
    first = 0;
    rows = 10;




    @ViewChild('dt2') table: Table;
    montantFiltreCalcule: boolean = false;
    totalMontantFiltre: number = 0;
    statuses!: any[];
    loading: boolean = true;
    activityValues: number[] = [0, 100];
    root: string | undefined;
    factures: FactureVente[] = [];
    Facturefilred: FactureVente[] = [];
    FacturefilredSuplim: FactureVente[] = [];

    client: User = new User();
    searchTerm: string = '';
    produit: Produit[] = [];
    idp?: number;
    idf?: number;
    idd?: number;
    visibleTranche: boolean = false;
    newFacture: Facture;

    visible: boolean = false;


    public valueSearching: any;
    public valuefirstname: any;
    public valuelastname: any;
    public valuetelephone: any;
    public valueemail: any;
    public valuepaye: any;
    public clientRechercher: any;
    public fournisseurrechercher: any;
    public transporteurrechercher: any;
    facturesFiltreAdv: Facture[] = [];
    private typeFacture: any;
    public typeA: any;
    public typeV: any;
    public totalFiltre: any = null;

    items: any[] | undefined;


    suggestions: any[] | undefined;


    public nbreTranche: any = 0;
    public totalTranchepaye: any = 0;
    public totalTrancheNonpaye: any = 0;


    public dialogTrancheDVisible: boolean = false;
    field: string;
    header: string;
    public balance: any = 0;

///p-dialogue deleteFactureAnd change prix

    openDialogueChangedPrix:boolean=false;

    produits!: Produit[];

    expandedRows = {};
    showDialog() {
        this.visible = true;
    }

    constructor(


        public factureVenteService: FactureVenteService,
        public userService: UserService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public activatedRoute: ActivatedRoute,
    ) {
    }


    ngOnInit(): void {
        this.loadFacture(this.currentPage, this.pageSize);

        // this.getAllFactures();
        this.calculateMontants();
        this.root = this.router.url.split('/')[1];
        const idpParam = <string>this.activatedRoute.snapshot.paramMap.get('idp')
        const iddParam = <string>this.activatedRoute.snapshot.paramMap.get('idd')
        if (idpParam !== null) {
            this.idp = +idpParam;
        }
        if (iddParam !== null) {
            this.idd = +iddParam;
        }



    }

    loadFacture(page: number, size: number) {
        this.loadingdata=true ;
        this.factureVenteService.LoadFactures(page, size).subscribe(
            (data: Page<FactureVente>) => {
                this.facturesPage = data;
                this.loadingdata=false;
            },
            (error) => {
                console.error('Erreur lors du chargement des factures', error);
            }
        );
    }


    onPageChange(event: any) {
        this.currentPage = event.page==undefined?0:event.page;
        this.pageSize = event.rows==undefined?10:event.rows
        this.loadFacture(this.currentPage, this.pageSize);

    }

    next() {
        if (!this.isLastPage()) {
            this.currentPage++;
            this.loadFacture(this.currentPage, this.pageSize);
        }
    }

    prev() {
        if (!this.isFirstPage()) {
            this.currentPage--;
            this.loadFacture(this.currentPage, this.pageSize);

        }

    }


    reset() {

        this.currentPage = 0; // Réinitialise à la première page
        this.loadFacture(this.currentPage, 10);
        this.totalMontantFiltre=0 ;
    }

    pageChange(event) {
        this.first = event.first;
        this.rows = event.rows;
    }

    isFirstPage() {
        return this.currentPage === 0;
    }

    isLastPage() {
        return (this.currentPage + 1) * this.pageSize >= this.produits.length;
    }


    getStatusSeverity(status: string) {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            default:
                return 'unknown'; // Or any other fallback value
        }
    }

    onRowExpand(event: TableRowExpandEvent) {
        // this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        // this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    }


    expandAll() {
        this.expandedRows = this.produits.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    }

    collapseAll() {
        this.expandedRows = {};
    }

    onDialogClose() {
        // Clear expanded rows when the dialog closes
        this.expandedRows = {};
    }

    searchFirstName(event: AutoCompleteCompleteEvent) {
        this.userService.getUsers().subscribe(users => {
            const listFirstName = users.map(user => user.firstname);
            this.suggestions = listFirstName
                .filter(firstName => firstName.toLowerCase().includes(event.query.toLowerCase()))
                .map(firstName => ({label: firstName, value: firstName})); // Ensure that label and value are the same
        });
    }

    searchLastName(event: AutoCompleteCompleteEvent) {
        this.userService.getUsers().subscribe(users => {
            const listLastName = users.map(user => user.lastname);
            this.suggestions = listLastName
                .filter(lastName => lastName.toLowerCase().includes(event.query.toLowerCase()))
                .map(lastName => ({label: lastName, value: lastName}));
        });
    }

    searchTelephone(event: AutoCompleteCompleteEvent) {
        this.userService.getUsers().subscribe(users => {
            const listTelephone = users.map(user => user.telephone);
            this.suggestions = listTelephone
                .filter(telephone => telephone.toString().includes(event.query))
                .map(telephone => ({label: telephone.toString(), value: telephone}));
        });
    }

    searchEmail(event: AutoCompleteCompleteEvent) {
        this.userService.getUsers().subscribe(users => {
            const listEmail = users.map(user => user.email);
            this.suggestions = listEmail
                .filter(email => email.toLowerCase().includes(event.query.toLowerCase()))
                .map(email => ({label: email, value: email}));
        });
    }

    clear(table: Table) {
        table.clear();
        this.montantFiltreCalcule = false;
        this.refrech()

    }

    // getAllFactures() {
    //     this.loading = true;
    //     this.factureService.getFactures().subscribe((value: Facture[]) => {
    //
    //         console.error(value)
    //
    //         this.factureService.FactureInter = [...value]
    //         this.loading = false;
    //         this.Facturefilred = [...value]
    //         this.FacturefilredSuplim = [...value]
    //     });
    // }

    goToFactureDetails(id: number): void {
        this.router.navigate(['uikit/factureVente/',id]);
    }

    editFacture(id: number) {
        this.router.navigate(['uikit/update-factureVente/', id]);
    }

    addFacture() {
        this.router.navigate(['/uikit/add-factureVente']);
    }
    //
    // onSearch(): void {
    //     if (this.searchTerm.trim() !== '') {
    //         this.factures = this.factureService.searchFacture(this.searchTerm.toLowerCase());
    //     } else {
    //         this.getAllFactures();
    //     }
    // }

    selectFacture(facture: Facture) {
        this.idf = facture.id;

        this.router.navigate(['/ajout-service/', this.idp, this.idf, this.idd]);
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

    getFilter(rechercheFacture: string): string {
        if (rechercheFacture.toLowerCase() === 'oui')
            return 'true';
        else if (rechercheFacture.toLowerCase() === 'non')
            return 'false'
        else return rechercheFacture
    }

    refrech() {
        this.resetForm()

        this.loadFacture(this.currentPage,this.pageSize);

        this.totalFiltre = null


    }

    resetForm() {

        this.typeA = false;
        this.typeV = false;
        this.clientRechercher = false;
        this.fournisseurrechercher = false;
        this.transporteurrechercher = false;
        this.valuefirstname = '';
        this.valuelastname = '';
        this.valuetelephone = '';
        this.valueemail = '';
        this.valuepaye = null;
        this.reset() ;
    }

    deleteFacture(facture: Facture) {

        this.factureDeleted = facture; // Store the facture that is going to be deleted

        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cette facture?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {

                    this.factureVenteService.deleteFacture(facture.id).subscribe(value => {
                        this.loadFacture(this.currentPage,this.pageSize)
                    })

            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Annuler!',
                    detail: 'La suppression de la facture est annulée!',
                });
                this.loadFacture(this.currentPage,this.pageSize)
            }
        });
    }



    confirmDeleteFacture(facture:Facture) {
        this.factureVenteService.removeFactureWithUpdateProduct(facture).subscribe(
            (response) => {
                console.log('Facture supprimée avec succès:', response);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Supprimée',
                    detail: 'Votre facture a été supprimée avec succès!',
                });
                this.loadFacture(this.currentPage,this.pageSize)
                // this.getAllFactures(); // Refresh the factures list after deletion
            },
            (error) => {
                console.error('Erreur lors de la suppression de la facture:', error);

                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de la suppression de la facture.',
                });
            }
        );
        this.openDialogueChangedPrix = false;

    }


    updateFacturePrix(ligneFacture: LigneFacture, historique: Historique) {
        ligneFacture.produit.prixUnitaire = historique.prixHistoriqueAchat;
    }

    CalculeMontantFiltrer(): number {
        const filteredFactures = this.table.filteredValue || this.Facturefilred;
        this.totalMontantFiltre = filteredFactures.reduce((acc, facture) => acc + facture.montant, 0);
        this.montantFiltreCalcule = true;
        return this.totalMontantFiltre
    }


    showDialogTranches(facture: Facture) {
        this.newFacture = facture;
        this.visibleTranche = true;
        this.calculateMontants();

    }

    totalMontantTranches: number = 0;
    montantTranchesPayees: number = 0;
    montantTranchesNonPayees: number = 0;
    public factureDeleted: Facture=new Facture();
    public PrixChoisie: number;



    calculateMontants() {
        this.totalMontantTranches = 0;
        this.montantTranchesPayees = 0;
        this.montantTranchesNonPayees = 0;

        if (this.newFacture?.tranches) {
            this.newFacture.tranches.forEach((tranche: Tranche) => {
                this.totalMontantTranches += tranche.montantTranche;
                if (tranche.statutPayement) {
                    this.montantTranchesPayees += tranche.montantTranche;
                } else {
                    this.montantTranchesNonPayees += tranche.montantTranche;
                }
            });
        }
    }

    getFiltered(rechercheFacture: string): string {
        if (rechercheFacture.toLowerCase() === 'oui')
            return 'true';
        else if (rechercheFacture.toLowerCase() === 'non')
            return 'false'
        else return rechercheFacture
    }

    public rechercheAvancee() {
        this.Facturefilred = this.FacturefilredSuplim.filter(fact => {
            let match = true;
            console.log(this.Facturefilred.length)


            match = match;

            if (match && (this.valuefirstname || this.valuelastname || this.valueemail || this.valuetelephone)) {
                let entityMatch = false;
                let searchAll = !this.clientRechercher && !this.fournisseurrechercher && !this.transporteurrechercher;

                // Si on recherche un client, fournisseur ou transporteur
                if (searchAll || this.clientRechercher) {
                    entityMatch = entityMatch || this.matchFacture(fact.client);
                }
                if (searchAll || this.fournisseurrechercher) {
                    entityMatch = entityMatch || this.matchFacture(fact.provider);
                }
                if (searchAll || this.transporteurrechercher) {
                    entityMatch = entityMatch || this.matchFacture(fact.transporteur);
                }

                match = match && entityMatch;
            }

            // Vérifier le statut de paiement
            if (match && this.valuepaye !== null && this.valuepaye !== undefined) {
                match = match && (fact.paye === this.valuepaye);
            }

            return match;
        });

        this.visible = false;
        this.totalFiltre = this.CalculeMontantFiltrer();

        // Calculer les montants des tranches
        const trancheFiltre = this.calculeTrancheFiltre();
        this.nbreTranche = trancheFiltre.totalTranches;
        this.totalTranchepaye = trancheFiltre.totalPaid;
        this.totalTrancheNonpaye = trancheFiltre.totalUnpaid;

        // Mettre à jour la pagination avec les factures filtrées
        this.facturesPage.content = [...this.Facturefilred];
        this.CalculeMontantFiltrer();
    }




    // public rechercheAvancee() {
    //     this.Facturefilred = this.FacturefilredSuplim.filter(fact => {
    //         let match = true;
    //         let typeMatch: boolean = false;
    //
    //         let notChecked: boolean = this.typeA != "FACTURE_ACHAT" && this.typeV != "FACTURE_VENTE"
    //
    //         if (notChecked || this.typeA == "FACTURE_ACHAT") {
    //             typeMatch = typeMatch || (fact.typeFacture === 'FACTURE_ACHAT')
    //
    //         }
    //
    //
    //         if (notChecked || this.typeV == "FACTURE_VENTE") {
    //             typeMatch = typeMatch || (fact.typeFacture === 'FACTURE_VENTE');
    //
    //
    //         }
    //
    //
    //         match = match && typeMatch;
    //
    //
    //         // Check client, provider, transporter based on selected checkboxes and fields
    //         if (match && (this.valuefirstname || this.valuelastname || this.valueemail || this.valuetelephone)) {
    //             let entityMatch = false;
    //             let searchAll = !this.clientRechercher && !this.fournisseurrechercher && !this.transporteurrechercher;
    //
    //             if (searchAll || this.clientRechercher) {
    //                 entityMatch = entityMatch || this.matchFacture(fact.client);
    //             }
    //             if (searchAll || this.fournisseurrechercher) {
    //                 entityMatch = entityMatch || this.matchFacture(fact.provider);
    //             }
    //             if (searchAll || this.transporteurrechercher) {
    //                 entityMatch = entityMatch || this.matchFacture(fact.transporteur);
    //             }
    //
    //             match = match && entityMatch;
    //         }
    //
    //         // Check payment status
    //         if (match && this.valuepaye !== null && this.valuepaye !== undefined) {
    //             match = match && (fact.paye === this.valuepaye);
    //         }
    //
    //         return match;
    //     });
    //
    //     this.visible = false;
    //     this.totalFiltre = this.CalculeMontantFiltrer()
    //
    //
    //     // this.calculateMontants();
    //     this.nbreTranche = this.calculeTrancheFiltre().totalTranches;
    //     this.totalTranchepaye = this.calculeTrancheFiltre().totalPaid;
    //     this.totalTrancheNonpaye = this.calculeTrancheFiltre().totalUnpaid;
    //     this.facturesPage.content=[...this.Facturefilred] ;
    //     this.CalculeMontantFiltrer() ;
    // }

    private matchFacture(entity: any): boolean {
        if (!entity) return false;

        let firstnameMatch = this.valuefirstname ? entity.firstname.toLowerCase().includes(this.valuefirstname.toLowerCase().trim()) : true;
        let lastnameMatch = this.valuelastname ? entity.lastname.toLowerCase().includes(this.valuelastname.toLowerCase().trim()) : true;
        let emailMatch = this.valueemail ? entity.email.toLowerCase().includes(this.valueemail.toLowerCase()) : true;
        let telephoneMatch = this.valuetelephone ? entity.telephone.includes(this.valuetelephone) : true;

        return firstnameMatch && lastnameMatch && emailMatch && telephoneMatch;
    }


    public calculeTrancheFiltre() {
        let totalTranches = 0;
        let totalPaid = 0;
        let totalUnpaid = 0;

        this.Facturefilred.forEach(factureInt => {
            if (factureInt.typeFacture == "FACTURE_ACHAT") {
                this.balance = this.balance - factureInt.montant;


            } else {
                this.balance = this.balance + factureInt.montant;

            }
            if (factureInt.tranches && Array.isArray(factureInt.tranches)) { // Check if tranche is defined and is an array
                factureInt.tranches.forEach(tranche => {
                    totalTranches++;
                    if (tranche.statutPayement) {
                        totalPaid += tranche.montantTranche;
                    } else {
                        totalUnpaid += tranche.montantTranche;
                    }
                });
            } else {
            }
        });

        return {
            totalTranches: totalTranches,
            totalPaid: totalPaid,
            totalUnpaid: totalUnpaid
        };
    }

}
