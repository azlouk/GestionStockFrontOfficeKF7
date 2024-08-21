import {booleanAttribute, Component, OnInit, ViewChild} from '@angular/core';
import {Facture, FactureInterface, factureType} from "../../../../../models/Facture";
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
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {Ripple, RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {SliderModule} from "primeng/slider";
import {TagModule} from "primeng/tag";
import {MultiSelectModule} from "primeng/multiselect";
import {SplitButtonModule} from "primeng/splitbutton";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {b} from "@fullcalendar/core/internal-common";
import {TriStateCheckboxModule} from "primeng/tristatecheckbox";
import {RadioButtonModule} from "primeng/radiobutton";
import {Observable} from "rxjs/internal/Observable";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CheckboxModule} from "primeng/checkbox";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {UserService} from "../../../../../layout/service/user.service";
import {FieldsetModule} from "primeng/fieldset";
import {Tranche} from "../../../../../models/Tranche";
import {TreeTableModule} from "primeng/treetable";
import {TabViewModule} from "primeng/tabview";

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
        ConfirmDialogModule,
        NgForOf,
        DatePipe,
        CurrencyPipe,
        TriStateCheckboxModule,
        RadioButtonModule,
        OverlayPanelModule,
        CheckboxModule,
        AutoCompleteModule,
        FieldsetModule,
        TreeTableModule,
        TabViewModule
    ],
    templateUrl: './facture.component.html',
    styleUrl: './facture.component.scss'
})
export class FactureComponent implements OnInit {

    @ViewChild('dt2') table: Table;
    montantFiltreCalcule: boolean = false;
    totalMontantFiltre: number = 0;
    statuses!: any[];
    loading: boolean = true;
    activityValues: number[] = [0, 100];
    root: string | undefined;
    factures: Facture[] = [];
    Facturefilred: FactureInterface[] = [];
    FacturefilredSuplim: FactureInterface[] = [];

    client: User = new User();
    searchTerm: string = '';
    produit: Produit[] = [];
    idp?: number;
    idf?: number;
    idd?: number;
    visibleTranche: boolean = false;
    newFacture: FactureInterface;

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

    selectedItem: any;

    suggestions: any[] | undefined;


    public nbreTranche: any = 0;
    public totalTranchepaye: any = 0;
    public totalTrancheNonpaye: any = 0;


    public dialogTrancheDVisible: boolean = false;
    field: string;
    header: string;
    public balance: any = 0;

    showDialog() {
        this.visible = true;
    }

    constructor(
        public factureService: FactureService,
        public userService: UserService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public activatedRoute: ActivatedRoute) {
    }


    ngOnInit(): void {
        this.getAllFactures();
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

    getAllFactures() {
        this.loading = true;
        this.factureService.getFactures().subscribe((value: FactureInterface[]) => {
            this.factureService.FactureInter = [...value]
            this.loading = false;
            this.Facturefilred = [...value]
            this.FacturefilredSuplim = [...value]
        });
    }

    goToFactureDetails(id: number): void {
        this.router.navigate(['uikit/facture/', id]);
    }

    editFacture(id: number) {
        this.router.navigate(['uikit/update-facture/', id]);
    }

    addFacture() {
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

        this.getAllFactures();

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

    CalculeMontantFiltrer(): number {
        const filteredFactures = this.table.filteredValue || this.Facturefilred;
        this.totalMontantFiltre = filteredFactures.reduce((acc, facture) => acc + facture.montant, 0);
        this.montantFiltreCalcule = true;
        return this.totalMontantFiltre
    }


    showDialogTranches(facture: FactureInterface) {
        this.newFacture = facture;
        this.visibleTranche = true;
        this.calculateMontants();

    }

    totalMontantTranches: number = 0;
    montantTranchesPayees: number = 0;
    montantTranchesNonPayees: number = 0;


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





    public rechecheAvancee() {
        this.Facturefilred = this.FacturefilredSuplim.filter(fact => {
            let match = true;
            let typeMatch: boolean = false;

            let notChecked: boolean = this.typeA != "FACTURE_ACHAT" && this.typeV != "FACTURE_VENTE"

            if (notChecked || this.typeA == "FACTURE_ACHAT") {
                typeMatch = typeMatch || (fact.typeFacture === 'FACTURE_ACHAT')

            }


            if (notChecked || this.typeV == "FACTURE_VENTE") {
                typeMatch = typeMatch || (fact.typeFacture === 'FACTURE_VENTE');


            }


            match = match && typeMatch;


            // Check client, provider, transporter based on selected checkboxes and fields
            if (match && (this.valuefirstname || this.valuelastname || this.valueemail || this.valuetelephone)) {
                let entityMatch = false;
                let searchAll = !this.clientRechercher && !this.fournisseurrechercher && !this.transporteurrechercher;

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

            // Check payment status
            if (match && this.valuepaye !== null && this.valuepaye !== undefined) {
                match = match && (fact.paye === this.valuepaye);
            }

            return match;
        });

        this.visible = false;
        this.totalFiltre = this.CalculeMontantFiltrer()


        // this.calculateMontants();
        this.nbreTranche = this.calculeTrancheFiltre().totalTranches;
        this.totalTranchepaye = this.calculeTrancheFiltre().totalPaid;
        this.totalTrancheNonpaye = this.calculeTrancheFiltre().totalUnpaid;

    }

    private matchFacture(entity: any): boolean {
        if (!entity) return false;

        let firstnameMatch = this.valuefirstname ? entity.firstname.toLowerCase().includes(this.valuefirstname.toLowerCase()) : true;
        let lastnameMatch = this.valuelastname ? entity.lastname.toLowerCase().includes(this.valuelastname.toLowerCase()) : true;
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

