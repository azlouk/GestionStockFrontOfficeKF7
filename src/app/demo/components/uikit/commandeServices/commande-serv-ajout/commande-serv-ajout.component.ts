import {Component, OnInit} from '@angular/core';
import {User} from "../../../../../models/user";
import {FactureService} from "../../../../../layout/service/facture.service";
import {UserService} from "../../../../../layout/service/user.service";
import {CommandeServ, Status} from "../../../../../models/CommandeServ ";
import {CommandeServiceService} from "../../../../../layout/service/commande-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {DecimalPipe, formatDate, NgIf} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CheckboxModule} from "primeng/checkbox";
import {InputNumberModule} from "primeng/inputnumber";
import {ServiceComp} from "../../../../../models/ServiceComp";
import {MultiSelectModule} from "primeng/multiselect";
import {ServiceCompService} from "../../../../../layout/service/service-comp.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {FieldsetModule} from "primeng/fieldset";
import {RadioButtonModule} from "primeng/radiobutton";
import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {MessageModule} from "primeng/message";
import {ProduitAjoutComponent} from "../../Products/produit-ajout/produit-ajout.component";
import {SliderModule} from "primeng/slider";
import {Table, TableModule} from "primeng/table";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {Produit} from "../../../../../models/produit";
import {LigneFacture} from "../../../../../models/LigneFacture";
import {LigneVente} from "../../../../../models/LigneVente";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {LigneCommande} from "../../../../../models/LigneCommande";

@Component({
    selector: 'app-commande-serv-ajout',
    standalone: true,
    imports: [
        ButtonModule,
        RippleModule,
        CalendarModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        CheckboxModule,
        InputNumberModule,
        MultiSelectModule,
        FieldsetModule,
        RadioButtonModule,
        ToastModule,
        DecimalPipe,
        DialogModule,
        MessageModule,
        NgIf,
        ProduitAjoutComponent,
        SliderModule,
        TableModule,
        ConfirmDialogModule
    ],
    templateUrl: './commande-serv-ajout.component.html',
    styleUrl: './commande-serv-ajout.component.scss'
})
export class CommandeServAjoutComponent implements OnInit {
    clients: User[] = []
    newCommandeService: CommandeServ = new CommandeServ();
    services: ServiceComp[];
    root: string;
    showAddProduit: boolean = false;
    produits: Produit[] = [];
    rechercheProduit: string = '';
    activityValues: number[] = [0, 100];


    constructor(private commandeService: CommandeServiceService,
                private userService: UserService,
                private produitService: ProduitService,
                private serviceCompService: ServiceCompService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.getAllClients();
        this.getAllServices();
        this.getAllProduits();
        this.updateRootFromCurrentPath();
        console.log(this.root)

    }

    private updateRootFromCurrentPath(): void {
        this.root = this.router.url; // Récupère le chemin actuel
        console.log("root", this.root)
    }

    getAllClients() {
        this.userService.getUsersClient().subscribe((value: User[]) => {
            this.clients = value
            console.table(this.clients)
        })
    }

    getAllServices(): void {
        this.serviceCompService.getServices().subscribe(
            (services: ServiceComp[]) => {
                this.services = services;
                //this.calculerCout();
                console.table(services);
            },
            (error: any) => {
                console.error('Error fetching services:', error);
                // this.displayusers = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Oops...',
                    detail: "Vous n'avez pas la permission, s'il vous plaît contactez l'administrateur."
                });
            }
        );
    }

    getAllProduits() {
        this.produitService.getProduits().subscribe((value: any) => {
            this.produits = value;
            // console.error(""+new JsonPipe().transform(this.produits))
        })
    }
    addNewCommande() {
        console.log("Commande avant envoi:", JSON.stringify(this.newCommandeService));
        console.log("Client avant envoi:", JSON.stringify(this.newCommandeService.client));
        console.log("Role du client:", this.newCommandeService.client.role);
        console.log("Nombre de produits:", this.newCommandeService.produits.length);

        // Formater les dates
        this.newCommandeService.dateCreation = formatDate(new Date(this.newCommandeService.dateCreation), 'yyyy-MM-dd', 'en-US');
        this.newCommandeService.dateEstimeeFin = formatDate(new Date(this.newCommandeService.dateEstimeeFin), 'yyyy-MM-dd', 'en-US');
        this.newCommandeService.dateValidationOuSortie = formatDate(new Date(this.newCommandeService.dateValidationOuSortie), 'yyyy-MM-dd', 'en-US');

        console.log("Date de validation ou sortie:", this.newCommandeService.dateValidationOuSortie);
        console.log("ID du client:", this.newCommandeService.client.id);

        this.commandeService.addCommande(this.newCommandeService).subscribe(
            (response) => {
                console.log('Commande créée avec succès:', response);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Commande créée avec succès!'
                });
                this.newCommandeService = new CommandeServ();

                console.log('Valeur de root:', this.root);

                if (this.root && this.root.includes('Ajout-Commande')) {
                    console.log('Redirection vers /uikit/Commandes');
                    this.router.navigate(['/uikit/Commandes']).then(success => {
                        if (success) {
                            console.log('Redirection réussie');
                        } else {
                            console.error('Échec de la redirection');
                        }
                    });
                } else {
                    console.log('Condition de redirection non remplie');
                }
            },
            (error) => {
                console.error('Erreur lors de la création de la commande:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors de la création de la commande!'
                });
            }
        );
    }

    returnBack() {

    }

    addProduit() {
        this.showAddProduit = true
    }

    clear(table: Table) {
        table.clear();
    }

    refresh() {
        this.getAllProduits();
    }

    addToCommande(produitInterface: Produit) {
        const existingProduct = this.newCommandeService.produits.find(product => product.produit.id === produitInterface.id);
        if (existingProduct) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Produit déjà dans la facture',
                detail: 'Ce produit est déjà dans la commande !',
                life: 1500
            });
        } else {
            // si le produit n'existe pas créer une nouvelle ligne de commande
            const produit: LigneCommande = new LigneCommande();
            produit.produit = produitInterface;
            produit.qtyV = 1;
            produit.prixVente = produit.prixVente;
            this.newCommandeService.produits.push(produit);
            this.messageService.add({
                severity: 'success',
                summary: 'Produit ajouté à la facture',
                detail: 'Le produit a été ajouté avec succès à la facture !',
                life: 1000
            });
            this.getVentePrix();
            this.calaculateCommandeTotal();

            // Vérifiez les valeurs
            console.log('Produits dans le service:', this.newCommandeService.produits);
        }
    }


    getVentePrix(): void {
        this.newCommandeService.totalProduits = 0;
        this.newCommandeService.produits.forEach(value => {
            const quantity = value.qtyV || 0; // Default to 0 if venteQty is null or undefined
            const price = value.produit.prixUnitaire + value.produit.gainUnitaire; // Default to 0 if prixVente is null or undefined

            this.newCommandeService.totalProduits += quantity * price;
        });

        console.log("Total Price:", this.newCommandeService.totalProduits);
    }

    handleQuantityChange(c: any): void {
        this.getVentePrix();
        this.calaculateCommandeTotal()
    }

    calaculateCommandeTotal(): void {
        // Calculer le total des produits
        this.getVentePrix();
        // Calculer le total des coûts de services
        this.getCoutService();
        // Assurez-vous que prixSupplimentaire est défini, sinon utilisez 0
        const prixSupplimentaire = this.newCommandeService.prixSupplimentaire || 0;
        // Calculer le total de la facture
        this.newCommandeService.prixTotal = this.newCommandeService.totalProduits +
            this.newCommandeService.totalCoutService +
            this.newCommandeService.prixSupplimentaire;
        console.log("Total Facture:", this.newCommandeService.prixTotal);
    }

    getCoutService(): void {
        this.newCommandeService.totalCoutService = 0;

        this.newCommandeService.services.forEach(service => {
            const cout = service.coutService || 0; // Default to 0 if coutService is null or undefined
            this.newCommandeService.totalCoutService += cout;
        });
        console.log("Total Service Cost:", this.newCommandeService.totalCoutService);
    }

    deleteProduct(index: number): void {
        if (index >= 0 && index < this.newCommandeService.produits.length) {
            this.confirmationService.confirm({
                message: 'Êtes-vous sûr de vouloir supprimer ce produit?',
                accept: () => {
                    // Supprimer le produit sélectionné de la liste
                    this.newCommandeService.produits.splice(index, 1);
                    this.getVentePrix();
                    this.calaculateCommandeTotal();
                    // Afficher un message de succès
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Produit supprimé avec succès'
                    });
                }
            });
        }
    }


    protected readonly Status = Status;
}
