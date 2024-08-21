import {Component, OnInit} from '@angular/core';
import {User} from "../../../../../models/user";
import {UserService} from "../../../../../layout/service/user.service";
import {CommandeServ, Status} from "../../../../../models/CommandeServ ";
import {CommandeServiceService} from "../../../../../layout/service/commande-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CurrencyPipe, DatePipe, DecimalPipe, formatDate, NgIf} from "@angular/common";
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
        ConfirmDialogModule,
        CurrencyPipe,
        DatePipe
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
    displayActionDialog: boolean = false;
    referenceCommande : string;
    constructor(private commandeService: CommandeServiceService,
                private userService: UserService,
                private produitService: ProduitService,
                private serviceCompService: ServiceCompService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    async ngOnInit(): Promise<void> {
        this.genererReference();
        this.updateRootFromCurrentPath();
        const id = this.route.snapshot.paramMap.get('id');

        try {
            if (id) {
                try {
                    // Fetching the Commande by ID
                    this.newCommandeService = await this.commandeService.getCommandeById(Number(id)).toPromise();
                    // Validate if lines of Commande are correctly fetched
                    if (Array.isArray(this.newCommandeService.produits)) {
                        this.newCommandeService.produits = this.newCommandeService.produits;
                    } else {
                        console.warn("Commande _lignesCommande is not an array or is undefined", this.newCommandeService.produits);
                    }

                    // Log the retrieved Commande data
                    console.log("Commande récupérée !!", this.newCommandeService);

                } catch (e) {
                    // Redirect if there is an error in fetching Commande
                    this.router.navigate(['uikit/commande']);
                }
            }

            // Fetch additional data needed for the component
            this.getAllClients();
            this.getAllProduits();
            this.getAllServices();
        } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    }


    private updateRootFromCurrentPath(): void {
        this.root = this.router.url; // Récupère le chemin actuel
    }

    getAllClients() {
        this.userService.getUsersClient().subscribe((value: User[]) => {
            this.clients = value
        })
    }

    getAllServices(): void {
        this.serviceCompService.getServices().subscribe(
            (services: ServiceComp[]) => {
                this.services = services;
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
        })
    }
    addNewCommande(): void {
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

        if (this.newCommandeService.id) {
            // Si un ID est présent, mettre à jour la commande existante
            this.commandeService.updateCommande(this.newCommandeService).subscribe(
                (response) => {
                    console.log('Commande mise à jour avec succès:', response);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Commande mise à jour avec succès!'
                    });
                    this.newCommandeService = new CommandeServ();
                    this.router.navigate(['/uikit/Commandes']);
                },
                (error) => {
                    console.error('Erreur lors de la mise à jour de la commande:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur lors de la mise à jour de la commande!'
                    });
                }
            );
        } else {
            // Sinon, ajouter une nouvelle commande
            this.commandeService.addCommande(this.newCommandeService).subscribe(
                (response) => {
                    this.referenceCommande = response.reference;  // Stocker la référence de la commande créée
                    console.log('Commande créée avec succès:', response);
                    this.imprimerTicket();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Commande créée avec succès!'
                    });
                    this.newCommandeService = new CommandeServ();
                    this.router.navigate(['/uikit/Commandes']);
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
    }


    confirmNavigation() {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir quitter cette page ?',
            accept: () => {
            }
        });
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

    imprimerCommande() {
        console.log('Impression de la commande...');
        // Ajouter ici la logique pour imprimer la commande
        this.router.navigate(['/uikit/Edit-Commande' ,this.newCommandeService.id])
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
    returnBack(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Êtes-vous sûr de vouloir revenir à la page des commandes ?',
            header: 'Confirmation de retour',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: "none",
            rejectIcon: "none",
            acceptLabel: "Oui", // Texte pour le bouton d'acceptation
            rejectLabel: "Non",
            rejectButtonStyleClass: "p-button-text p-button-danger",
            acceptButtonStyleClass: "p-button-text p-button-success",
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Retour confirmé',
                    detail: 'Redirection vers la page des commandes...',
                    life: 3000 // Durée d'affichage du message
                });
                setTimeout(() => {
                    this.router.navigate(['/uikit/Commandes']);
                }, 2000); // Délai de 500ms avant la redirection
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Retour annulé',
                    detail: 'Vous restez sur la page actuelle.',
                    life: 3000 // Durée d'affichage du message
                });
            }
        });
    }

    genererReference(): void {
        const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
        this.newCommandeService.reference = `CMD-${randomPart}`;
    }
    imprimerTicket(): void {
        const printWindow = window.open();
        printWindow.document.write('<html><head><title>Commande service</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
        printWindow.document.write('p { margin: 10px 0; }'); // Augmente l'espacement entre les lignes
        printWindow.document.write('.text-red { color: red; font-weight: bold; }');
        printWindow.document.write('.text-center { text-align: center; }');
        printWindow.document.write('.ml-4 { margin-left: 1rem; }'); // Ajoute une marge à gauche pour aligner
        printWindow.document.write('.p-2 { padding: 0.5rem; }'); // Ajoute un padding pour l'espacement interne
        printWindow.document.write('.inline { display: inline-block; margin-right: 10px; }'); // Ajoute un espace entre les éléments en ligne
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body >');
        printWindow.document.write('<h3 class="ml-4">Commande service</h3>');
        printWindow.document.write('<p>______________________________________</p>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Référence:</strong></span><span class="inline">${this.newCommandeService.reference}</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Nom Client:</strong></span><span class="inline">${this.newCommandeService.client.firstname + ' ' + this.newCommandeService.client.lastname}</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Nom panne:</strong></span><span class="inline">${this.newCommandeService.nomPanne}</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Date de Création:</strong></span><span class="inline">${this.newCommandeService.dateCreation}</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Date Estimée Fin:</strong></span><span class="inline">${this.newCommandeService.dateEstimeeFin}</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Date Validation/Sortie:</strong></span><span class="inline">${this.newCommandeService.dateValidationOuSortie}</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Description:</strong></span><span class="inline">${this.newCommandeService.descriptionPanne}</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Avance:</strong></span><span class="inline"  style="font-family: bold; font-size: x-large; color: #0fd00f;">${this.newCommandeService.avance} TND</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline text-red"><strong>Total:</strong></span><span class="inline text-red">${this.newCommandeService.prixTotal} TND</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<div class="ml-4 p-2">');
        printWindow.document.write(`<span class="inline"><strong>Reste à payer:</strong></span><span class="inline text-red">${this.newCommandeService.prixTotal - this.newCommandeService.avance} TND</span>`);
        printWindow.document.write('</div>');
        printWindow.document.write('<p>______________________________________</p>');
        printWindow.document.write('<h4 class="ml-4">**** Merci pour votre Confiance ! ****</h4>');

        printWindow.document.close(); // Nécessaire pour IE >= 10
        printWindow.focus(); // Nécessaire pour IE >= 10
        printWindow.print();
    }

    protected readonly Status = Status;
}
