import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Facture, factureType} from "../../../../../models/Facture";
import {Depot} from "../../../../../models/Depot";
import {CodeModel, Produit} from "../../../../../models/produit";
import {RoleEnum, User} from "../../../../../models/user";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LigneFacture} from "../../../../../models/LigneFacture";
import {FactureService} from "../../../../../layout/service/facture.service";
import {DepotService} from "../../../../../layout/service/depot.service";
import {UserService} from "../../../../../layout/service/user.service";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CalendarModule} from "primeng/calendar";
import {ListboxModule} from "primeng/listbox";
import {Table, TableModule} from "primeng/table";
import {CommonModule, DecimalPipe} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {MessagesModule} from "primeng/messages";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {MultiSelectModule} from "primeng/multiselect";
import {SliderModule} from "primeng/slider";
import {CardModule} from "primeng/card";
import {RippleModule} from "primeng/ripple";
import {InputSwitchModule} from "primeng/inputswitch";
import {ToggleButtonModule} from "primeng/togglebutton";
import {InputTextModule} from "primeng/inputtext";
import {Tranche} from "../../../../../models/Tranche";
import {AjoutUserComponent} from "../../users/ajout-user/ajout-user.component";
import {TrancheService} from "../../../../../layout/service/tranche.service";
import {Article} from "../../../../../models/Article";
import {ProduitAjoutComponent} from "../../Products/produit-ajout/produit-ajout.component";
import {RadioButtonModule} from "primeng/radiobutton";
import {ConfirmationService, MessageService} from "primeng/api";
import {MessageModule} from "primeng/message";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {FieldsetModule} from "primeng/fieldset";
import {FileUploadModule} from "primeng/fileupload";
import {GenerationcodeComponent} from "../../../utilities/generationcode/generationcode.component";
import {GenerationqrComponent} from "../../../utilities/generationqr/generationqr.component";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgxBarcode6Module} from "ngx-barcode6";
import {DialogService} from "../../../../../layout/service/dialogue-user.service";

@Component({
    selector: 'app-facture-ajout',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CalendarModule,
        ListboxModule,
        TableModule,
        DecimalPipe,
        InputNumberModule,
        MessagesModule,
        DropdownModule,
        CommonModule,
        DialogModule,
        MultiSelectModule,
        SliderModule,
        CardModule,
        RippleModule,
        InputSwitchModule,
        ToggleButtonModule,
        InputTextModule,
        AjoutUserComponent,
        ProduitAjoutComponent,
        RadioButtonModule,
        MessageModule,
        ConfirmDialogModule,
        ToastModule,
        FieldsetModule,
        FileUploadModule,
        GenerationcodeComponent,
        GenerationqrComponent,
        InputTextareaModule,
        NgxBarcode6Module
    ],
    templateUrl: './facture-ajout.component.html',
    styleUrl: './facture-ajout.component.scss'
})
export class FactureAjoutComponent implements OnInit {
    @Input() showRetourButton: boolean = true;
    newFacture = new Facture();
    depots: Depot[] = [];
    produits: Produit[] = [];
    utilisateurs: User[] = [];
    utilisateursClients: User[] = [];
    providers: User[] = [];
    produitsFiltres: Produit[];
    tranches: Tranche[] = [];
    newProduct: Produit = new Produit();
    rechercheProduit: string = '';
    userForm: FormGroup;
    roles = Object.values(RoleEnum);
    autoReference: boolean = true;
    composantBVisible = false;
    utilisateursTransporteur: User[] = [];

    @ViewChild('dt3') table: Table;
    montantFiltreCalcule: boolean = false;
    totalMontantFiltre: number = 0;


    activityValues: number[] = [0, 100];

    root: string;
    showButtun: boolean = true;
    showAddUser: boolean = false;
    showAddProduit: boolean = false;
    isUpdateValide = false;
    private Tranchefilred: Tranche[];


    clear(table: Table) {
        table.clear();
    }

    constructor(
        private cdr: ChangeDetectorRef,
        private factureService: FactureService,
        private depotService: DepotService,
        private userService: UserService,
        private produitService: ProduitService,
        private trancheService: TrancheService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public dialogueService:DialogService
    ) {
        this.newFacture.lignesFacture = []
        this.produitsFiltres = []
        this.userForm = this.formBuilder.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            tel: ['', Validators.required],
            address: ['', Validators.required],
            role: ['', Validators.required],
        });
        this.newFacture.dateCreation = new Date();
    }

    async ngOnInit(): Promise<void> {
        this.updateRootFromCurrentPath();
        const id = this.route.snapshot.paramMap.get('id');
        try {
            if (id) {
                try {
                    this.newFacture = await this.factureService.getFactureById(Number(id)).toPromise()
                    this.isUpdateValide = true
                    if (Array.isArray(this.newFacture.lignesFacture)) {
                        this.newFacture.lignesFacture = this.newFacture.lignesFacture;
                    } else {
                        console.warn("Facture _lignesFacture is not an array or is undefined", this.newFacture.lignesFacture);
                    }
                } catch (e) {
                    this.router.navigate(['uikit/facture']);
                }

            }

            this.newFacture.typeFacture = factureType.SORTIE;
            this.getAllTranches();
            this.getAllClient();
            this.getAllTrans();
            this.getAllProvider();
            this.getAllProduits();
            this.getAllDepots();

            console.log("Facture récupérée !!", this.newFacture);
        } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    }

    toggleComposantB() {
        this.composantBVisible = !this.composantBVisible;
    }

    getAllDepots() {
        this.depotService.getdepots().subscribe((value: Depot[]) => {
            this.depots = value;
            console.log(this.depots);
            //console.log('List of services:', this.services);
        });
    }

    filtrerProduits(recherche: string) {
        console.log(recherche)
        this.produitsFiltres = this.produits.filter((produit: Produit) => {
            return produit.nom.includes(recherche) ||
                produit.dataqr.includes(recherche)
        });
    }

    getAllClient() {
        this.userService.getUsersClient().subscribe((value: User[]) => {
            this.utilisateursClients = value
            // console.log(new JsonPipe().transform(this.utilisateurs) )
        })
    }

    getAllTranches() {
        this.trancheService.getTranches().subscribe((value: Tranche[]) => {
            this.tranches = value
            // console.log(new JsonPipe().transform(this.tranches) )
        })
    }

    getAllTrans() {
        this.userService.getUsersTransporteur().subscribe((value: User[]) => {
            this.utilisateursTransporteur = value
        })
    }

    getAllProvider() {
        this.userService.getUsersProviders().subscribe((value: User[]) => {
            this.providers = value
        })
    }

    getAllProduits() {
        this.produitService.getProduits().subscribe((value: any) => {
            this.produits = value;
            // console.error(""+new JsonPipe().transform(this.produits))
        })
    }

    createNewFacture(): void {


        // Validation des champs obligatoires
        if (!this.validateFacture()) {
            return;
        }

        console.log('Contenu de la facture à enregistrer :', this.newFacture);

        this.confirmationService.confirm({
            header: "facture est entièrement réglée  ?",
            icon: "pi pi-exclamation-triangle",
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.newFacture.paye = true;
                this.saveFacture();
            },
            reject: () => {
                this.newFacture.paye = false;
                this.saveFacture();
            }
        });
    }

    private saveFacture() {
        this.newFacture.montant = this.getToTalFacture();
        if (this.newFacture.id) {
            // Mise à jour de la facture existante
            this.factureService.updateFacture(this.newFacture).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Enregistrement',
                        detail: 'Votre facture est bien enregistrée',
                        life: 3000

                    });

                    // Attendez que le toast disparaisse avant de rediriger
                    setTimeout(() => {
                        this.router.navigate(['uikit/facture']);
                    }, 1000);
                },
                (error) => {
                    console.error('Erreur de mise à jour:', error);
                }
            );
        } else {
            // Création d'une nouvelle facture
            this.factureService.addFacture(this.newFacture).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Enregistrement',
                        detail: 'Votre facture est bien enregistrée',
                        life: 3000

                    });

                    // Attendez que le toast disparaisse avant de rediriger
                    setTimeout(() => {
                        this.router.navigate(['uikit/facture']);
                    }, 1000);
                },
                (error) => {
                    console.error('Erreur de création:', error);
                }
            );
        }
        this.resetForm();
    }

    private resetForm() {
        // Réinitialisez le formulaire ici si nécessaire
        this.newFacture = new Facture();
    }

    validateFacture(): boolean {
        if (this.newFacture.depot.id == 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucun Dépot n\'a été sélectionné pour la facture',
                life: 3000

            });
            return false;
        } else if (this.newFacture.lignesFacture.length == 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucun produit n\'a été sélectionné pour la facture',
                life: 3000

            });
            return false;
        } else if (this.newFacture.client.id == 0 && this.newFacture.typeFacture !== 'FACTURE_ACHAT') {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucun client n\'a été sélectionné pour la facture',
                life: 3000

            });
            return false;
        } else if (this.newFacture.provider.id == 0 && this.newFacture.typeFacture == 'FACTURE_ACHAT') {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucun Fournisseur n\'a été sélectionné pour la facture',
                life: 3000

            });
            return false;
        } else if (this.newFacture.transporteur.id == 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucun transporteur n\'a été sélectionné pour la facture',
                life: 3000

            });
            return false;
        }
        return true;
    }

    deleteProduct(p: LigneFacture): void {
        this.newFacture.lignesFacture = this.newFacture.lignesFacture.filter(value => value.produit.id !== p.produit.id)
        this.calaculateFactureTotalAcht();
    }

    calculeFactureTotal() {
        this.newFacture.montant = 0;
        this.newFacture.lignesFacture.forEach(value => {
            if (value.quantite > value.produit.qantite) {
                value.quantite = value.produit.qantite;
            }
            if (value.quantite < value.produit.minQuantiteGros) {
                this.newFacture.montant += value.quantite * (value.produit.prixUnitaire + value.produit.gainUnitaire);
                value.montantTotal = value.quantite * (value.produit.prixUnitaire + value.produit.gainUnitaire);
                console.log(value.montantTotal);
            } else {
                this.newFacture.montant += value.quantite * (value.produit.prixGros + value.produit.gainGros);
                value.montantTotal = value.quantite * (value.produit.prixGros + value.produit.gainGros)
                console.log(value.montantTotal);
            }
        })
    }

    calaculateFactureTotalAcht() {
        this.newFacture.montant = 0;
        this.newFacture.lignesFacture.forEach(value => {
            if (this.newFacture.typeFacture === 'FACTURE_ACHAT') {
                this.newFacture.montant += value.quantite * value.prixAchat;
            } else {

                if (value.quantite <= value.produit.qantite) {
                    this.newFacture.montant += value.quantite * this.getPrixCalculateVente(value);

                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Produit epiusé',
                        detail: 'Le quantité insufisant !',
                        life: 3000
                    });
                    value.quantite = value.produit.qantite

                }
                this.newFacture.montant += value.quantite * this.getPrixCalculateVente(value);
            }
            console.log(this.newFacture.montant);  // Vous pouvez aussi afficher montantTotal si nécessaire
        });
    }

    getPrixCalculateVente(l: LigneFacture): number {
        if (l.quantite < l.produit.minQuantiteGros) {
            return l.produit.prixUnitaire + l.produit.gainUnitaire;
        } else {
            return l.produit.prixUnitaire + l.produit.gainGros;
        }
    }

    getPrixCalculateAchat(l: LigneFacture): number {

        return l.produit.prixUnitaire;
    }

    getPrixCalculate(l: LigneFacture): number {
        if (l.quantite < l.produit.minQuantiteGros) {
            return l.produit.prixUnitaire + l.produit.gainUnitaire;
        } else {
            return l.produit.prixUnitaire + l.produit.gainGros;
        }
    }

    changeType() {
        this.newFacture.typeFacture = this.newFacture.typeFacture === factureType.SORTIE
            ? factureType.ENTREE
            : factureType.SORTIE;
        // Manually trigger change detection
        this.cdr.detectChanges();
        console.log(this.newFacture.typeFacture)
    }

    returnBack() {
        this.factureService.returnBack();
    }

    addToFacture(produitInterface: Produit) {
        const existingProduct = this.newFacture.lignesFacture.findIndex(product => product.produit.id === produitInterface.id);
        console.table(produitInterface)
        if (produitInterface.qantite > 0) {

            if (existingProduct >= 0) {
                if (this.newFacture.lignesFacture[existingProduct].quantite < this.newFacture.lignesFacture[existingProduct].produit.qantite) {
                    this.newFacture.lignesFacture[existingProduct].quantite += 1;

                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Produit epiusé',
                        detail: 'Le quantité insufisant !',
                        life: 3000
                    });
                }

            } else {
                // si le produit n'existe pas créer une nouvelle ligne de facture
                const ligneFacture: LigneFacture = new LigneFacture(new Date().getTime(), 1, 0, produitInterface, produitInterface.prixUnitaire, produitInterface.prixUnitaire + produitInterface.gainUnitaire);
                // ligneFacture.produit = produitInterface;
                // ligneFacture.quantite = 1;
                ligneFacture.montantTotal = ligneFacture.prixAchat * ligneFacture.quantite
                this.newFacture.lignesFacture.push(ligneFacture);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Produit ajouté à la facture',
                    detail: 'Le produit a été ajouté avec succès à la facture !',
                    life: 3000
                });
            }
            this.calaculateFactureTotalAcht();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Produit epiusé',
                detail: 'Le quantité insufisant !',
                life: 3000
            });
            if (this.newFacture.typeFacture === 'FACTURE_ACHAT')
                this.newFacture.lignesFacture[existingProduct].quantite = this.newFacture.lignesFacture[existingProduct].produit.qantite

        }
    }

    private updateRootFromCurrentPath(): void {
        this.root = this.router.url; // Récupère le chemin actuel
        this.updateShowButtun();
    }

    // Fonction pour mettre à jour showButtun en fonction de la valeur de root
    Newtranche: Tranche = new Tranche();

    private updateShowButtun(): void {
        this.showButtun = !this.root.includes('caisse');
    }

    AddTrancheToNewFacture() {
        this.Newtranche.user = new User()
        this.newFacture.tranches.push(this.Newtranche);
        this.Newtranche = new Tranche()
    }

    updateTrancheLocal(updatedTranche: Tranche, index: number) {
        if (index > -1) {
            // Mettre à jour la tranche localement
            this.newFacture.tranches[index] = updatedTranche;
            this.messageService.add({
                severity: 'success',
                summary: 'Mis à jour !',
                detail: 'La tranche a été mise à jour localement.',
                life: 2000
            });
        }
    }

    deleteTrancheNewFacture(index: number) {
        if (index > -1) {
            const trancheToRemove = this.newFacture.tranches[index];
            this.removeTranche(trancheToRemove, index);
        }
    }

    removeTranche(tranche: Tranche, index: number) {
        this.confirmationService.confirm({
            message: "Vous ne pourrez pas revenir en arrière !",
            header: "Es-tu sûr ?",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Oui, supprimez-le !",
            rejectLabel: "Non",
            acceptButtonStyleClass: "custom-accept-button",
            rejectButtonStyleClass: "custom-reject-button",
            accept: () => {
                this.trancheService.deleteTranche(tranche.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Supprimé',
                            detail: 'Votre tranche a été supprimée!',
                            life: 2000
                        });
                        // Mettre à jour la liste locale après la suppression réussie
                        this.newFacture.tranches.splice(index, 1);
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Il y a eu un problème lors de la suppression.',
                            life: 2000
                        });
                    }
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Annuler',
                    detail: 'La supprission de tranche est annuler!.',
                    life: 1000
                });
            }
        });
    }

    addUser() {
        this.dialogueService.openDialog();
    }

    addProduit() {
        this.showAddProduit = true
    }

    refresh() {
        this.getAllProduits();
    }

    refreshUser() {
        // this.getAllUsers();
        this.getAllTrans();
        this.getAllProvider();
        this.getAllClient()

    }

    protected readonly factureType = factureType;
    protected readonly confirm = confirm;
    public typeCalculeDialogue: boolean = false;

    public modifierProduit(id) {
        this.router.navigate(['/uikit/edit-produit', id]);
    }

    public onRowEditCancel(l: LigneFacture) {
        // this.newFacture.lignesFacture[index] = this.clonedLignesFactures[l.id as string];
        // delete this.clonedLignesFactures[l.id as string];


    }

    public onRowEditSave(l: any) {
        if (this.newFacture.typeFacture === 'FACTURE_ACHAT')
            if (l.prixAchat !== l.produit.prixUnitaire) {
                this.typeCalculeDialogue = true;
            }

    }


    public onRowEditInit(l: any) {


    }

    public hideDialog() {

        this.typeCalculeDialogue = false;
    }

    onQuantiteChange(newValue: number, item: any) {

        if (newValue > item.produit.qantite) {
            item.quantite = 0; // Réinitialisez la valeur si elle dépasse la quantité
        } else {
            item.quantite = newValue; // Sinon, mettez à jour la valeur normalement
        }
        this.calaculateFactureTotalAcht(); // Appeler la méthode de recalcul si nécessaire
    }

    public getMontantLigne(l: LigneFacture) {
        return this.newFacture.typeFacture == factureType.ENTREE ? l.quantite * l.prixAchat : l.quantite * l.prixVente;

    }

    total: number = 0;

    public getToTalFacture(): number {

        this.total = 0;
        this.newFacture.lignesFacture.map(value => {
            this.total += this.getMontantLigne(value)
        })
        this.total += this.total * (this.newFacture.montantTaxe / 100);
        return this.total
    }

    CalculeMontantFiltrer() {
        const filteredTranche = this.table.filteredValue || this.newFacture.tranches;
        this.totalMontantFiltre = filteredTranche.reduce((acc, tranche) => acc + tranche.montantTranche, 0);
        this.montantFiltreCalcule = true;
    }

    public resetMontantFiltreCalcule() {

    }
}

