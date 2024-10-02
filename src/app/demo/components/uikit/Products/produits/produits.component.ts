import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {CurrencyPipe, DatePipe, JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {OrderListModule} from "primeng/orderlist";
import {PickListModule} from "primeng/picklist";
import {RatingModule} from "primeng/rating";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import Swal from 'sweetalert2';
import {ProductService} from "../../../../service/product.service";
import {FormsModule} from "@angular/forms";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {Produit} from "../../../../../models/produit";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressBarModule} from "primeng/progressbar";
import {SliderModule} from "primeng/slider";
import {Table, TableModule} from "primeng/table";
import {Router} from "@angular/router";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {FileUploadModule} from "primeng/fileupload";
import {DialogModule} from "primeng/dialog";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";
import {ImageModule} from "primeng/image";
import {GalleriaModule} from "primeng/galleria";
import {File} from "../../../../../models/File";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {Historique} from "../../../../../models/historique";
import {Page} from "../../../../../models/page";
import {Article} from "../../../../../models/Article";

@Component({
    selector: 'app-produits',
    standalone: true,
    imports: [
        ButtonModule,
        DataViewModule,
        DropdownModule,
        InputTextModule,
        NgForOf,
        OrderListModule,
        PickListModule,
        RatingModule,
        SharedModule,
        FormsModule,
        CurrencyPipe,
        DatePipe,
        MultiSelectModule,
        ProgressBarModule,
        SliderModule,
        TableModule,
        NgClass,
        RippleModule,
        ToastModule,
        ToolbarModule,
        FileUploadModule,
        DialogModule,
        ImageModule,
        NgIf,
        GalleriaModule,
        AvatarModule,
        BadgeModule
    ],
    templateUrl: './produits.component.html',
    styleUrl: './produits.component.scss'
})
export class ProduitsComponent implements OnInit {


    first = 0;
    rows = 10;


    imageUrl = ""

    idd?: number;
    produits: Produit[] = [];
    historiques: Historique[] = [];
    selectedProducts: Produit [] = [];
    deleteProductsDialog: boolean = false;
    displayusers: boolean = true;
    images: any[] = [];
    visible: boolean = false;
    loadingdata: boolean = false;
    loading: boolean = false;
    @ViewChild('filter') filter!: ElementRef;

    produitsPage!: Page<Produit>;
    currentPage: number = 0;
    pageSize: number = 10; // Nombre d'éléments par page

    constructor(private productService: ProductService,
                private produitService: ProduitService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private router: Router,
                private sanitizer: DomSanitizer) {
        this.produits = this.fetchProducts();

    }

    ngOnInit() {
        this.getAllProduits();
        // this.LoadProduits(0, 10);
        this.loadProduits(this.currentPage, this.pageSize);
    }


    loadProduits(page: number=0, size: number=10) {
        this.produitService.LoadProduits(page, size).subscribe(
            (data: Page<Produit>) => {
                this.produitsPage = data;
            },
            (error) => {
                console.error('Erreur lors du chargement des produits', error);
            }
        );
    }

    // Méthode à appeler lors de la navigation entre les pages


    fetchProducts(): Produit[] {
        // Créez un tableau de produits avec des données d'exemple
        return Array.from({ length: 100 }, (_, i) => {
            return new Produit(
                i + 1, // id
                `Produit ${i + 1}`, // nom
                Math.random() * 100, // prixUnitaire
                Math.random() * 100, // prixGros
                `Description du produit ${i + 1}`, // description
                Math.floor(Math.random() * 50), // qantite
                new Blob(), // image
                Math.random() * 10, // gainUnitaire
                Math.random() * 10, // gainGros
                [], // files
                new Date(Date.now() + Math.random() * 10000000000), // dateExpiration
                new Date(Date.now() - Math.random() * 10000000000), // dateFabrication
                Math.floor(Math.random() * 10), // minQuantiteGros
                Math.random() * 20, // taxe
                true, // enable
                `Data QR ${i + 1}`, // dataqr
                Math.floor(Math.random() * 20), // qantiteFacture
                new Article(), // article (assurez-vous que l'objet Article est correctement instancié)
                Math.floor(Math.random() * 100), // levelstock
                false, // showDetails
                false, // checkedService
                [], // subdataqr
                [] // historiques
            );
        });
    }



    // fetchProducts() {
    //     // Remplacez cela par la logique pour obtenir vos produits
    //     return Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Produit ${i + 1}` }));
    // }


    get currentProducts() {
        const start = this.currentPage * this.pageSize;
        return this.produits.slice(start, start + this.pageSize);
    }

    onPageChange(event: any) {
        this.currentPage = event.page;
        this.pageSize = event.rows;
        this.loadProduits(this.currentPage, this.pageSize);
    }

    next() {
        if (!this.isLastPage()) {
            this.currentPage++;
        }
    }

    prev() {
        if (!this.isFirstPage()) {
            this.currentPage--;
        }
    }


    reset() {
        this.currentPage = 0; // Réinitialise à la première page
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


    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

// ------------ list Produits ------------
    getAllProduits() {
        this.loadingdata = true;
        this.produitService.getProduits().subscribe(
            (value: Produit[]) => {
                this.produits = value;

                this.loadingdata = false;
            },
            error => {
                this.displayusers = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Oops...',
                    detail: "Vous n'avez pas la permission, s'il vous plaît contacter l'administrateur.",
                });
                this.loadingdata = false;
            }
        );
    }

    // LoadProduits(page: number = 0, size: number = 10) {
    //     this.produitService.getProduits(page, size).subscribe(
    //         (data: Page<Produit>) => {
    //             this.produitsPage = data; // Stocke les produits et les métadonnées de pagination
    //         },
    //         (error) => {
    //             console.error('Erreur lors du chargement des produits', error);
    //         }
    //     );
    // }
    // onPageChange(event: any) {
    //     const page = event.page;
    //     const size = event.rows;
    //     this.getAllProduits(page, size); // Appelle la méthode avec les nouvelles valeurs de page et taille
    // }

    supprimerProduit(id: number): void {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Voulez-vous supprimer ce produit ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                this.produitService.supprimerProduit(id).subscribe(
                    (response: any) => {

                        if (response) {
                            this.getAllProduits();
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


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    modifierProduit(id: number): void {
        this.router.navigate(['/uikit/edit-produit', id]); // Redirection vers la page de modification avec l'ID du produit
    }

    newProduit(): void {
        this.router.navigate(['/uikit/ajout-produit']); // Redirection vers la page de modification avec l'ID du produit
    }


    defaultImageUrl = '../../assets/no-picture-taking.png';

    loadFileByProduct(product: Produit): SafeUrl[] {
        let safeImages: SafeUrl[] = [];

        if (product && product.files && product.files.length > 0) {
            product.files.forEach((file: File) => {
                if (file && file.path) {

                    this.imageUrl = `http://localhost:8082/img/${file.name}`;

                    let safeUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageUrl);
                    safeImages.push(safeUrl);
                }
            });
        }
        return safeImages;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    protected readonly JSON = JSON;

    refresh() {
        this.getAllProduits();
        this.router.navigate(['/uikit/produits']);
    }

    public visibleShowDetails: boolean = false;


    public showDetail(id: Number) {
        this.visibleShowDetails = true;

        this.produitService.getHistoriques(id).subscribe(
            (value: Historique[]) => {
                this.historiques = value;

            },
            error => {
                console.error(error)
            }
        );

    }


    public closeShowDetails() {
        this.visibleShowDetails = false;

    }
}