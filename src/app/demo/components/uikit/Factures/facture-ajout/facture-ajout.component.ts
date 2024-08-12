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
    produitsFactures: LigneFacture[] = [];
    ligneProduits: Produit [] = [];
    activityValues: number[] = [0, 100];
    selectedDepot: any = null;
    idDepot: number = 0;
    idClient: number = 0;
    root: string;
    showButtun: boolean = true;
    showAddUser: boolean = false;
    showAddProduit: boolean = false;
    codeISvalide=true ;
    subdataqr:CodeModel[]=[] ;
    uploadedFiles: any[] = [];
    @ViewChild('dt') dt: Table;

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
        private confirmationService: ConfirmationService
    ) {
        this.produitsFactures = []
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
                const facture = await this.factureService.getFactureById(Number(id)).toPromise();
                this.newFacture = facture;
                if (Array.isArray(facture.lignesFacture)) {
                    this.produitsFactures = facture.lignesFacture;
                } else {
                    console.warn("Facture _lignesFacture is not an array or is undefined", facture.lignesFacture);
                }
            }

            this.newFacture.typeFacture = factureType.SORTIE;
            this.getAllTranches();
            this.getAllUsers();
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

    getAllUsers() {
        this.userService.getUsersClient().subscribe((value: User[]) => {
            this.utilisateurs = value
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
        this.newFacture.lignesFacture = this.produitsFactures;

        // Validation des champs obligatoires
        if (!this.validateFacture()) {
            return;
        }

        console.log('Contenu de la facture à enregistrer :', this.newFacture);

        this.confirmationService.confirm({
            header: "Cette facture est payée ?",
            message: "Vous ne pourrez pas revenir en arrière !",
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
        if (this.newFacture.id) {
            // Mise à jour de la facture existante
            this.factureService.updateFacture(this.newFacture).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Enregistrement',
                        detail: 'Votre facture est bien enregistrée'
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
                        detail: 'Votre facture est bien enregistrée'
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
            this.messageService.add({severity:'error', summary:'Erreur', detail:'Aucun Dépot n\'a été sélectionné pour la facture'});
            return false;
        } else if (this.newFacture.lignesFacture.length == 0) {
            this.messageService.add({severity:'error', summary:'Erreur', detail:'Aucun produit n\'a été sélectionné pour la facture'});
            return false;
        } else if (this.newFacture.client.id == 0 && this.newFacture.typeFacture !== 'FACTURE_ACHAT') {
            this.messageService.add({severity:'error', summary:'Erreur', detail:'Aucun client n\'a été sélectionné pour la facture'});
            return false;
        } else if (this.newFacture.provider.id == 0 && this.newFacture.typeFacture == 'FACTURE_ACHAT') {
            this.messageService.add({severity:'error', summary:'Erreur', detail:'Aucun Fournisseur n\'a été sélectionné pour la facture'});
            return false;
        } else if (this.newFacture.transporteur.id == 0) {
            this.messageService.add({severity:'error', summary:'Erreur', detail:'Aucun transporteur n\'a été sélectionné pour la facture'});
            return false;
        }
        return true;
    }

    deleteProduct(p: LigneFacture): void {
        this.produitsFactures = this.produitsFactures.filter(value => value.produit.id !== p.produit.id)
        this.calaculateFactureTotalAcht();
    }

    calculeFactureTotal() {
        this.newFacture.montant = 0;
        this.produitsFactures.forEach(value => {
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
        this.produitsFactures.forEach(value => {
            if (this.newFacture.typeFacture === 'FACTURE_ACHAT') {
                this.newFacture.montant += value.quantite * this.getPrixCalculateAchat(value);
            } else {
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

        return l.produit.prixUnitaire
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
        const existingProduct = this.produitsFactures.find(product => product.produit.id === produitInterface.id);
        if (existingProduct) {
            this.messageService.add({severity:'warn', summary:'Produit déjà dans la facture', detail:'Ce produit est déjà dans la facture !',life: 1500});
        } else {
            // si le produit n'existe pas créer une nouvelle ligne de facture
            const ligneFacture: LigneFacture = new LigneFacture();
            ligneFacture.produit = produitInterface;
            ligneFacture.quantite = 1;
            ligneFacture.montantTotal = 0;
            this.produitsFactures.push(ligneFacture);
            this.messageService.add({severity:'success', summary:'Produit ajouté à la facture', detail:'Le produit a été ajouté avec succès à la facture !',life: 1000});
        }
        this.calaculateFactureTotalAcht();
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
                detail: 'La tranche a été mise à jour localement.'
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
                        this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Votre tranche a été supprimée!', life: 1000 });
                        // Mettre à jour la liste locale après la suppression réussie
                        this.newFacture.tranches.splice(index, 1);
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Il y a eu un problème lors de la suppression.', life: 1000 });
                    }
                });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Annuler', detail: 'La supprission de tranche est annuler!.', life: 1000 });
            }
        });
    }
    addUser() {
        this.showAddUser = true
    }
    addProduit() {
        this.showAddProduit = true
    }
    refresh() {
        this.getAllProduits();
    }
    refreshUser(){
        this.getAllUsers();
    }
    protected readonly factureType = factureType;
    protected readonly confirm = confirm;
}

