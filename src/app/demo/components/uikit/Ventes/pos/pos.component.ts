import {
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    ChangeDetectorRef, NgZone
} from '@angular/core';
import { MessageService } from 'primeng/api'
import {MenuItem} from "primeng/api/menuitem";
import {CodeModel, Produit} from "../../../../../models/produit";
import {Vente} from "../../../../../models/Vente";
import {Article} from "../../../../../models/Article";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {LigneVente} from "../../../../../models/LigneVente";
import {Message} from "primeng/api/message";
import {getTitleTicket, getToken, getUserDecodeID, setTitleTicket, setVentes} from "../../../../../../main";
import Swal from "sweetalert2";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {VenteService} from "../../../../../layout/service/vente.service";
import {CommonModule, CurrencyPipe, DatePipe, JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {User} from "../../../../../models/user";
import {forkJoin} from "rxjs/internal/observable/forkJoin";
import {Table, TableModule} from "primeng/table";
import {POSService} from "../../../../service/pos.service";
import {ClotureService} from "../../../../service/cloture.service";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputSwitchModule} from "primeng/inputswitch";
import {DataViewModule} from "primeng/dataview";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AutoFocusModule} from "primeng/autofocus";
import {MessageModule} from "primeng/message";
import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {CheckboxModule} from "primeng/checkbox";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from "primeng/card";
import {TagModule} from "primeng/tag";
import {RatingModule} from "primeng/rating";
import {ToolbarModule} from "primeng/toolbar";
import {Cloture} from "../../../../../models/Cloture";
import {File} from "../../../../../models/File";
import {GalleriaModule} from "primeng/galleria";
import {environment} from "../../../../../../environments/environment";
import {RippleModule} from "primeng/ripple";

@Component({
    selector: 'app-pos',
    standalone: true,
    imports: [
        InputNumberModule,
        NgClass,
        ButtonModule,
        DropdownModule,
        FormsModule,
        InputSwitchModule,
        DataViewModule,
        OverlayPanelModule,
        TableModule,
        AutoFocusModule,
        NgIf,
        MessageModule,
        ToastModule,
        DialogModule,
        CurrencyPipe,
        CheckboxModule,
        InputGroupAddonModule,
        InputGroupModule,
        InputTextModule,
        NgForOf,
        CardModule,
        TagModule,
        RatingModule,
        ToolbarModule,
        CommonModule,
        RippleModule
    ],
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.scss'
})
export class POSComponent implements OnInit,OnDestroy {
    @ViewChild('dv') dv: DataView | undefined;
    itemsArticles: MenuItem[]=[];
    focusIndex :number = 0;
    searchTerm: string = '';
    searchTerm1: string = '';
    searchText: string = '';
    produits: Produit[] = [];
    produitsOrderBy: Produit[] = [];
    produitsFiltres: Produit [] = [];
    cloture: Cloture = new Cloture();
    listeVente: Vente[] = [];
    visibleDetails: boolean=false;

    selectedVente: Vente = new Vente();
    divVisible: boolean = true;
    visible: boolean = false;
    show: boolean = false;
    position: string = 'top';
    loading: boolean = true;
    IsvisiblePop: boolean = false;
    layout: any = 'grid';
    autoimprimer: boolean = true;
    visibleimage: boolean = false;
    frais: number = 0;
    reglement: number = 0;
    articles: Article[] = [];
    calculatorScreenValue:string='0' ;
    TotalProductNb: number = 0;
    TotalAndReglement: any = {total: 0, reglement: 0};
    safeImageUrl: { id: number, urls: SafeUrl }[] = [];
    // Ajoutez cette méthode pour formater la date au format 'YYYY-MM-DD'
    product:Produit=new Produit() ;

    SelectetLigne:LigneVente=new  LigneVente();

    focusFrais: boolean=false;
    focusReg: boolean=false;
    focusRecherche:boolean=false ;
    produit: Produit = new Produit();
    calculateValue: string='0';

    rows = 10; // Number of rows to be fetched initially
    lazyLoad = true; // Set to true for lazy loading
    public widthWindow:any ;
    public heigthWindow:any ;


    @ViewChild('dtt') dtt : DataView | undefined ;
    @ViewChild('searchInput') searchInput!: ElementRef;
    @ViewChild('ajouterProduitButton') ajouterProduitButton!: ElementRef;
    messages1: Message[] = [];


    ngOnInit(): void {
        this.widthWindow=window.innerWidth ;
        this.heigthWindow=window.innerHeight/2 ;
        this.messages1 = [{severity: 'error', summary: 'Error', detail: 'Pas des images'}];
        this.getAllArticles();
        this.getAllProduits() ;
    }

    onResize($event:any) {
        this.widthWindow=window.innerWidth ;
        this.heigthWindow=window.innerHeight/2 ;

    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }
    getTitle(){
        return getTitleTicket()==''?'pas de titre':getTitleTicket()
    }
    async  setTitle(){
        const {value: titre} = await Swal.fire({
            title: "Titre de ticket",
            input: "text",
            inputValue: getTitleTicket(),
            inputLabel: "le titre sera afficher sur le ticket de client ",
            inputPlaceholder: "taper le titre de ticket ( Exple Nom entreprise...)"
        });
        if (titre) {

            setTitleTicket(titre) ;


        }
    }
    toggleDivVisibility() {
        this.divVisible = !this.divVisible;
    }

    constructor(private produitService: ProduitService,
                public venteService: VenteService,
                private posService: POSService,
                private clotureService: ClotureService,
                private renderer: Renderer2,
                private route: Router,  private datePipe: DatePipe,
                private messageService: MessageService,
                private sanitizer: DomSanitizer ,
                private cdr: ChangeDetectorRef,
                private ngZone: NgZone
    ) {
        const idrandom = 1;
        this.selectedVente = new Vente(idrandom, new Date().toString(), 'client ' + idrandom, 0, 0, [], getUserDecodeID());
        this.listeVente.push(this.selectedVente);
        this.reglement = this.selectedVente.total;
    }

    ngOnDestroy(): void {
        setVentes(this.listeVente)
    }
    addVente() {
        if (this.selectedVente.lignesVente.length != 0) {
            this.getTotalVente();
            this.selectedVente.reglement = this.reglement==0?this.selectedVente.total:this.reglement;
            // alert(new JsonPipe().transform(this.selectedVente))
            this.selectedVente.employer=new User(getUserDecodeID().id)
            const nameclient=this.selectedVente.nomClient
            this.selectedVente.nomClient=getTitleTicket();
            this.selectedVente.dateVente=new Date().toString();
            this.produitService.SaveVente(this.selectedVente).subscribe(value => {
                if (value) {
                    this.clearVente();
                    this.getAllProduits()
                    this.showTopCenter("Votre Vente est bien enregistré ")
                    if (this.selectedVente.isPrint) {
                        Swal.fire({
                            title: "Alerte de fermeture automatique!",
                            html: "I will close in <b></b> milliseconds.",
                            timer: 1000,
                            timerProgressBar: true,

                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                // console.log("I was closed by the timer");
                            }
                        });

                    } else {
                        this.clearVente();
                    }
                }else {
                    this.showTopCenter("Votre Vente n'est pas   enregistré ")

                }
            },error => {
                console.log(error)
            })
        } else {
            Swal.fire({
                title: "Pas de vente ?",
                text: "SVP ajouter des produits ",
                icon: "info"
            });
        }
    }

    saveVente() {
        // Vérifier si this.selectedVente et this.selectedVente.lignesVente sont définis et que lignesVente est itérable
        if (this.selectedVente && this.selectedVente.lignesVente) {

            // Calculer le total de la vente
            this.getTotalVente();

            // Définir le règlement de la vente (si égal à 0, utiliser le total de la vente)
            this.selectedVente.reglement = this.reglement == 0 ? this.selectedVente.total : this.reglement;

            // Définir l'employé associé à la vente
            this.selectedVente.employer = new User(getUserDecodeID().id);

            // Sauvegarder la vente via le service produit
            const nameclient = this.selectedVente.nomClient;

            this.produitService.SaveVente(this.selectedVente).subscribe(value => {
                // Vérifier si la sauvegarde a réussi
                if (value) {
                    // Effacer les données de la vente après sauvegarde réussie
                    this.clearVente();

                    // Afficher un message de confirmation
                    this.showTopCenter("Votre Vente est bien enregistré ");

                    // Si l'option d'auto-impression est activée, afficher une alerte avec succès
                    if (this.autoimprimer) {
                        Swal.fire({
                            title: "Votre vente est bien enregistrée !",
                            text: "L'alerte se fermera automatiquement.",
                            icon: "success",
                            timer: 1000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                    }
                } else {
                    // Afficher un message si la sauvegarde a échoué
                    this.showTopCenter("Votre Vente n'est pas enregistrée");
                }
            }, error => {
                // Gérer les erreurs éventuelles lors de la sauvegarde
                console.log(error);
                this.showTopCenter("Une erreur est survenue lors de la sauvegarde de la vente.");
            });
        } else {
            // Afficher une alerte si aucune ligne de vente n'a été ajoutée ou si lignesVente n'est pas itérable
            Swal.fire({
                title: "Pas de vente ?",
                text: "SVP ajouter des produits",
                icon: "info"
            });
        }
        this.clearVente();
        // Afficher dans la console les détails de la vente sélectionnée (pour vérification)
        console.log('selected vente', this.selectedVente);
    }
    getAllProduits() {
        this.loading=true ;
        this.produitService.getProduits().subscribe((value: Produit[]) => {
            this.produits = value;
            this.loading=false ;
            this.cdr.detectChanges();
            console.table(this.produits)
        })
    }
    getProduitByQtyventeOrder(){
        this.produitService.getProduitOrderByQtyVDesc().subscribe((value: Produit[]) => {
            value.forEach((value1:Produit) => {
                this.loadFile(value1) ;
            })
            this.produitsOrderBy = value;
            this.changeTable();
        })
        // console.log("produits recants:",this.produitsOrderBy)
    }
    goHome(){
        this.route.navigate([""])
    }
    clearTableVente() {
        if (this.selectedVente.lignesVente.length != 0) {
            Swal.fire({
                title: "Vous êtes sûr ?",
                text: "Suppression définitive",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Oui, Vider Tout"
            }).then((result) => {
                if (result.isConfirmed) {
                    this.ngZone.run(() => {
                        this.clearVente();
                    });

                    Swal.fire({
                        title: "Vider!",
                        text: "Votre vente est bien effacée",
                        icon: "success"
                    });
                }
            });
        } else {
            Swal.fire({
                title: "Vider ?",
                text: "Votre vente est déjà vide",
                icon: "info"
            });
        }
    }

    clearVente() {
        this.selectedVente.lignesVente = []; // Vide les lignes de vente
        this.TotalProductNb = 0;
    }

    isButtonFocused(index: number): boolean {
        return this.focusIndex === index;
    }

    focusOnSearchInput(): void {
        if (this.searchInput && this.searchInput.nativeElement) {
            this.searchInput.nativeElement.focus();
        }
    }

    focusOnQuantityInput(): void {
        // Get the quantity input element using the Renderer2
        const quantityInput = this.renderer.selectRootElement('.table input[type="number"]');

        // Check if the quantity input element exists
        if (quantityInput) {
            // Focus on the quantity input element
            this.renderer.selectRootElement('.table input[type="number"]').focus();
        }
    }

    focusOnSupprimerButton(): void {
        if (this.selectedVente.lignesVente.length > 0) {
            const supprimerButton = document.getElementById("suppLigneVente");
            if (supprimerButton) {
                supprimerButton.focus();
            }
        }
    }




    createImageUrl(blob: Blob): SafeUrl {
        const imageUrl = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }


    async loadFile(produit:Produit): Promise<void> {
        this.visibleimage = true;

        const observables = produit.files.map(value => this.produitService.getImageProduit(value.name));

        forkJoin(observables).subscribe(
            (responses: Blob[]) => {
                responses.forEach(data => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const blobUrl = URL.createObjectURL(data);
                        this.safeImageUrl.push({id:produit.id,urls:blobUrl});
                    };
                    reader.readAsText(data);
                });

                // Manually trigger change detection after all images are loaded
                this.cdr.detectChanges();
            },
            error => {
                //  console.error('Error loading files:', error);
            }
        );
    }
    search(): void {
        // Filtrer les produits en fonction du terme de recherche
        if (this.searchTerm.trim() !== '') {
            this.produitsFiltres = []
            this.produitService.getProduitByQrNom(this.searchTerm).subscribe((value: Produit) => {
                if (value != null) {
                    this.produitsFiltres.push(value);

                    this.visible = this.IsvisiblePop;
                }

                if (this.IsvisiblePop == false)
                    this.ajouterProduit()
            });
        }

    }

    showTopCenter(message: string) {
        this.messageService.add({key: 'tc', severity: 'warn', summary: 'Warn', detail: message});
    }

    ajouterProduitSelectionne(index: number): void {
        if (index >= 0 && index < this.produitsFiltres.length) {
            const produitSelectionne = this.produitsFiltres[index];
            const ligneExistante = this.selectedVente.lignesVente.find(ligne => ligne.produit.id === produitSelectionne.id);
            if (ligneExistante) {
                // Si une ligne existe déjà, incrémenter la quantité si elle n'a pas atteint la limite
                if (ligneExistante.venteQty < ligneExistante.produit.qantite) {
                    ligneExistante.venteQty += 1;
                } else {
                    // Gérer le cas où la quantité maximale est atteinte
                    this.showTopCenter('La quantité pour ' + ligneExistante.produit.nom + ' est dépassée. Il vous reste ' + ligneExistante.produit.qantite);
                }
            } else {
                // Créer une nouvelle ligne de vente si aucune ligne existante n'est trouvée
                const ligneVente = new LigneVente();
                ligneVente.id = produitSelectionne.id; // Assurez-vous que id est correctement initialisé si nécessaire
                ligneVente.venteQty = 1; // Quantité initiale (vous pouvez ajuster selon vos besoins)
                ligneVente.prixVente = produitSelectionne.prixUnitaire + produitSelectionne.gainUnitaire;
                ligneVente.produit = produitSelectionne;

                // Ajouter la nouvelle ligne au début de la liste (utilisation de unshift pour insérer au début)
                if (!this.selectedVente.lignesVente) {
                    this.selectedVente.lignesVente = []; // Initialiser si nécessaire
                }
                this.selectedVente.lignesVente.unshift(ligneVente);

                // Mettre le focus sur l'entrée de recherche après l'ajout
                this.focusOnSearchInput();
            }
        }

        // Réinitialiser le terme de recherche après l'ajout
        this.searchTerm = '';
    }


    updatePrixVente(ligneVente: LigneVente): void {
        const produit = ligneVente.produit;
        if (ligneVente.venteQty >= produit.minQuantiteGros) {
            ligneVente.prixVente = produit.prixUnitaire + produit.gainGros;
        } else {
            ligneVente.prixVente = produit.prixUnitaire + produit.gainUnitaire;
        }
        this.getTottalNbProduct()

    }
    getTottalNbProduct() {
        this.TotalProductNb =this.selectedVente.lignesVente.length;
    }

    ajouterProduit(): void {
        if (this.produitsFiltres.length > 0) {
            this.ajouterProduitSelectionne(0);
            this.getTottalNbProduct()
        }
    }
    getSommeTotale(): number {
        let sommeTotale = 0;
        for (const ligneVente of this.selectedVente.lignesVente) {
            sommeTotale += ligneVente.venteQty * ligneVente.prixVente;
        }
        return sommeTotale;
    }

    getSommeTaxes(): number {
        let sommeTaxes = 0;
        for (const ligneVente of this.selectedVente.lignesVente) {
            sommeTaxes += ligneVente.produit.taxe * ligneVente.venteQty; // Utilisez l'opérateur d'addition pour accumuler les taxes
        }
        return sommeTaxes;
    }
    addProductToSale(produit: Produit) {
        const existingLigneVente = this.selectedVente.lignesVente.find(ligne => ligne.produit.id === produit.id);
        if (existingLigneVente) {
            // Si le produit existe, augmenter la quantité
            if (existingLigneVente.venteQty < existingLigneVente.produit.qantite) {
                existingLigneVente.venteQty += 1;
                //  this.showTopCenter("Produit déjà existe dans le panier") ;
            } else {
                // Afficher un message si la quantité maximale est atteinte
                this.showTopCenter(`Quantité ${existingLigneVente.produit.nom} dépassée. Il vous reste ${existingLigneVente.produit.qantite}`);
            }
        } else {
            // Si le produit n'existe pas, créer une nouvelle ligne de vente
            const newLigneVente = new LigneVente();
            newLigneVente.id = produit.id;
            newLigneVente.venteQty=Number(this.calculateValue)?parseFloat(this.calculateValue):0 ;
            newLigneVente.venteQty = 1;
            newLigneVente.prixVente = produit.prixUnitaire + produit.gainUnitaire;
            newLigneVente.produit = produit;

            this.calculateValue='0' ;
            this.calculatorScreenValue='0'
            this.selectedVente.lignesVente.unshift(newLigneVente);

            // Mettre le focus sur le champ de recherche après l'ajout
            this.focusOnSearchInput();

        }

        this.getTottalNbProduct()
        this.searchTerm = ''; // Réinitialiser le terme de recherche
    }


    getProduitsByArticle(article: Article): void {
        alert(new JsonPipe().transform(article))
        if(article) {
            // @ts-ignore
            this.dtt.filter(article.id)
        }
    }
    getAllArticles() {
        this.produitService.getArticles().subscribe((value: Article[]) => {
            this.articles = value;
            console.table(this.articles)

        }, error => {
            // this.displayusers = false;
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vous n'avez pas la permission s'il vous plait  contacter l'administrateur.  ",
            });
        })
    }

    supprimerProduit(index: number): void {
        // Check if the index is valid
        if (index >= 0 && index < this.selectedVente.lignesVente.length) {
            // Remove the selected product from the list
            this.selectedVente.lignesVente.splice(index, 1);
            this.getTottalNbProduct()
        }
    }

    matchesSearchTerm(ligneVente: any): boolean {
        const searchTerm1 = this.searchTerm1.toLowerCase();

        // Check against all relevant attributes
        const productName = ligneVente.produit.nom.toLowerCase();
        const price = ligneVente.prixVente.toString().toLowerCase();
        const quantity = ligneVente.venteQty.toString().toLowerCase();
        const total = (ligneVente.venteQty * ligneVente.prixVente).toString().toLowerCase();

        // Customize this condition based on your requirements
        return productName.includes(searchTerm1) ||
            price.includes(searchTerm1) ||
            quantity.includes(searchTerm1) ||
            total.includes(searchTerm1);
    }


    // imprimer(): void {
    //   // Récupérez le contenu que vous souhaitez imprimer
    //   const contenuImprimer = document.getElementById('contenuImprimerTICKet');
    //
    //   if (contenuImprimer)
    //     Swal.fire({
    //       title: "Imprission",
    //       html: contenuImprimer.innerHTML,
    //       width: 800,
    //       heightAuto: true,
    //       showCancelButton: true,
    //       showConfirmButton: true,
    //       confirmButtonText: 'Imprimer'
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         if (contenuImprimer) {
    //           // Ouvrez une nouvelle fenêtre avec des dimensions spécifiées
    //           const fenetreImpression = window.open('', 'PRINT', 'width=600,height=600');
    //
    //           if (fenetreImpression) {
    //             // Ajoutez le contenu à la fenêtre d'impression
    //             fenetreImpression.document.write('<html lang="fr"><head><title>Imprimer</title></head><body>');
    //             fenetreImpression.document.write(contenuImprimer.innerHTML);
    //             fenetreImpression.document.write('</body></html>');
    //
    //             // Appelez la fonction d'impression
    //             fenetreImpression.document.close();
    //             fenetreImpression.print();
    //             fenetreImpression.close();
    //             this.selectedVente.id=0;
    //             this.clearVente();
    //           } else {
    //             // Gestion d'erreur si la fenêtre n'a pas pu être ouverte
    //            // console.error('La fenêtre d\'impression n\'a pas pu être ouverte.');
    //           }
    //         }
    //       }
    //     });
    //
    // }

    clear(table: Table) {
        table.clear();
    }

    getTotalVente(): number {
        let val = this.getSommeTotale() + this.getSommeTaxes() + this.frais;
        this.selectedVente.total = val;
        this.selectedVente.reglement=val ;
        return this.selectedVente.total;
    }


    showClotureDIv() {
        this.clotureService.getTotalClotureNow(new Date()).subscribe(value => {
            this.TotalAndReglement = value;
            console.error(value)
        })

        this.show = !this.show
    }

    saveCloture() {
        this.cloture.employer.id = getUserDecodeID().id;
        this.cloture.dateCloture = new Date();
        this.clotureService.SaveCloture(this.cloture).subscribe(
            value => {
                // console.log(value);
                this.show = false;

                // Utiliser SweetAlert pour afficher un message de succès
                Swal.fire({
                    icon: 'success',
                    title: 'Succès!',
                    text: 'La clôture a été enregistrée avec succès!',
                });
            },
            error => {
                // Utiliser SweetAlert pour afficher un message d'erreur
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur!',
                    text: 'Une erreur est survenue lors de l\'enregistrement de la clôture. Veuillez réessayer.',
                });

                // Gérer les erreurs ici si nécessaire
                console.error('Erreur lors de l\'enregistrement de la clôture', error);
            }
        );
    }

    async showDialog() {
        const {value: nomClient} = await Swal.fire({
            title: "Client",
            input: "text",
            inputValue: "client " + (this.listeVente.length + 1),
            inputLabel: "nom client!",
            inputPlaceholder: "nom du clients"
        });
        if (nomClient) {
            if (this.selectedVente.lignesVente.length != 0) {
                this.selectedVente = new Vente(this.listeVente.length + 1, new Date().toString(), nomClient, 0, 0, [], getUserDecodeID());
                this.listeVente.push(this.selectedVente);
                this.getTottalNbProduct()

                // console.log("ligne Ventes:", this.listeVente);
            } else {
                Swal.fire({
                    title: "Vider  !",
                    text: "Votre vente est déja vidé",
                    icon: "error"
                });
            }
        }
    }


    calculatorInput(value: string) {
        try {
            // console.log("Value Data : "+this.calculateValue)
            // console.log("Data pressed: "+value)
            if(this.calculateValue=='0'){
                this.calculateValue='' ;
            }
            let lasCar:string='' ;
            if( this.calculateValue!=='') {
                lasCar = this.calculateValue.toString().charAt(this.calculateValue.length - 1)
            }
            // @ts-ignore
            if( !Number(value) && (lasCar=='/' || lasCar=='*' || lasCar=='-' || lasCar =='+') && lasCar =='0'){
                this.calculateValue = this.calculateValue.toString().substring(0, this.calculateValue.toString().length - 1) + value
            }else if( value!=='CC' && value!=='C' && value!=='R' && value!=='='  ) {
                this.calculateValue += value;
            }
            switch (value) {
                case 'C':
                    this.SelectetLigne = new LigneVente();
                    this.calculateValue = '0';
                    break;

                case 'CC':
                    if (this.SelectetLigne.id !== 0) {
                        this.selectedVente.lignesVente.forEach(value1 => {
                            if (value1.id == this.SelectetLigne.id)
                                value1.venteQty = 0;
                        })
                        this.calculateValue = '0';
                    }
                    // Custom action for 'CC'
                    break;

                case 'R': {
                    // console.log(typeof this.calculateValue)
                    const newCalcule: string = this.calculateValue.toString().slice(0, -1);
                    this.calculateValue = newCalcule;
                    if (this.calculateValue === '') {
                        this.calculateValue = '0';
                    }
                    try {
                        this.calculateValue = eval(this.calculateValue);
                        if (this.SelectetLigne.id != 0) {
                            this.selectedVente.lignesVente.forEach(value1 => {
                                if (value1.id == this.SelectetLigne.id)
                                    value1.venteQty = parseFloat(this.calculateValue);
                            })
                        }
                    } catch (error) {
                        this.calculateValue = '0'
                        this.calculatorScreenValue = '0'
                        // console.log(error)
                    }


                }
                    break;

                case '=':
                    // Evaluate the expression and update the display
                    try {
                        this.calculateValue = eval(this.calculateValue);
                        if (this.SelectetLigne.id != 0) {
                            this.selectedVente.lignesVente.forEach(value1 => {
                                if (value1.id == this.SelectetLigne.id)
                                    value1.venteQty = parseFloat(this.calculateValue);
                            })
                        }
                    } catch (error) {
                        this.calculatorScreenValue='0' ;
                        this.calculateValue='0' ;
                        //  console.log(error)
                    }
                    break;

                default:
                    try {


                        this.calculateValue = eval(this.calculateValue);
                        if (this.SelectetLigne.id != 0) {
                            this.selectedVente.lignesVente.forEach(value1 => {
                                if (value1.id == this.SelectetLigne.id)
                                    value1.venteQty = parseFloat(this.calculateValue);
                            })
                        }
                    } catch (e) {

                        // console.log(e)
                    }
            }
            this.getTotalOperation();
        } catch (e) {
            this.calculatorScreenValue='0' ;
            this.calculateValue='0' ;
            // console.log('log : error ch')
        }


    }
    evaluateCalculator(value :string):boolean {
        //  console .log((this.calculateValue.match(/[\+\-\*\/]/g) || []).length < 1)
        return (this.calculateValue.match(/[\+\-\*\/]/g) || []).length < 1 ;
    }

    changeFocus(ligneVente: LigneVente | undefined | null) {
        //alert(ligneVente) ;
        if(ligneVente==undefined){
            this.focusReg=true ;
        } else if(this.focusFrais==null){
            this.focusFrais=true ;
        }else {

            this.focusFrais = false;
            this.focusReg = false;
            this.focusRecherche=true ;
            this.SelectetLigne = ligneVente;
            this.selectedVente.lignesVente.forEach(value => {
                if (value.id === ligneVente.id) {
                    value.focus = true
                } else {
                    value.focus = false;
                }

            })

        }

    }

    changeTable() {
        if (this.searchText.trim() !== ''){
            this.getAllProduits()
        }
        else {
            this.produitsOrderBy.forEach((value1:Produit) => {
                this.loadFile(value1) ;
            })
            this.produits=this.produitsOrderBy;

        }
    }

    getTotalOperation() {

        try {
            this.calculatorScreenValue= eval(this.calculateValue) ;
        } catch (e) {
            this.calculatorScreenValue = eval(this.calculateValue.toString().substring(0, this.calculateValue.length - 1));
        }
    }
    afficherImage: boolean=true;
    defaultImageUrl = '../../assets/no-picture-taking.png';

    loadFileByProduct(product: Produit) {
        let safeImages: SafeUrl[] = [];

        if (product && product.files && product.files.length > 0) {

            console.log(safeImages)
            return this.sanitizer.bypassSecurityTrustUrl(`http://localhost:8081/img/${product.files[0].name}`);
        }

        return this.defaultImageUrl ;
    }



    detailproduit(produit: Produit) {
        this.product=produit ;
        this.visibleDetails=true

    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // Check if the pressed key is a number, operator, or special key
        if(this.focusFrais==false && this.focusReg==false && this.focusRecherche==false) {
            if ((event.key >= '0' && event.key <= '9') || ['/', '*', '-', '+', '.', '=', 'Enter', 'Backspace'].includes(event.key)) {
                // Call the calculatorInput function with the pressed key
                if (event.key == "Enter") {
                    this.calculatorInput('=');

                } else if (event.key == "Backspace") {
                    this.calculatorInput('R');
                } else {
                    this.calculatorInput(event.key);
                }
            }
        }
    }

    getSeverity(product: Produit) {
        if (product.qantite === 0) {
            return 'danger'; // Épuisé en rouge
        } else if (product.levelstock < product.qantite) {
            return 'success'; // Disponible en vert
        } else if (product.levelstock > product.qantite) {
            return 'warning'; // Stock limite en orange
        } else {
            return null;
        }
    }
    getStockLabel(product: Produit): string {
        if (product.qantite == 0) {
            return 'EPUISE';
        } else if (product.levelstock < product.qantite) {
            return 'ENSTOCK';
        } else {
            return 'STOCKLIMITE';
        }
    }
    getUnite(product: Produit): string {
        if (product.article.unite === 'PIECE') {
            return 'pcs';
        } else if (product.article.unite === 'ML') {
            return 'ml';
        } else if (product.article.unite === 'G') {
            return 'g';
        } else if (product.article.unite === 'CM') {
            return 'cm';
        } else {
            return '';
        }
    }
    async EditshowDialog() {
        const {value: nomClient} = await Swal.fire({
            title: "Client",
            input: "text",
            inputValue:  this.selectedVente.nomClient,
            inputLabel: "nom client!",
            inputPlaceholder: "nom du clients"
        });
        if (nomClient) {

            this.selectedVente.nomClient=nomClient ;
            this.listeVente=[...this.listeVente]

        }
    }
    changeFocusSearch() {
        this.focusReg=false;
        this.focusFrais=false ;
        this.focusRecherche=true ;
    }
    setReglement(reglement: number) {
        //alert(reglement)
        // this.selectedVente.reglement=reglement;
        this.reglement=reglement ;
    }
    protected readonly Date = Date;
    filter(searchText: string) {

    }

    changeFocusCal() {
        this.focusReg=false;
        this.focusFrais=false ;
        this.focusRecherche=false ;
    }

    protected readonly Vente = Vente;

}
