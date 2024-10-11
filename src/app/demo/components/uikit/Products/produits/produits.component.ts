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
import {FormsModule} from "@angular/forms";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {Produit} from "../../../../../models/produit";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressBarModule} from "primeng/progressbar";
import {SliderModule} from "primeng/slider";
import {Table, TableModule} from "primeng/table";
import {Router, RouterLink} from "@angular/router";
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
import {PaginatorModule} from "primeng/paginator";
import {RadioButtonModule} from "primeng/radiobutton";

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
        BadgeModule,
        RouterLink,
        PaginatorModule,
        RadioButtonModule
    ],
    templateUrl: './produits.component.html',
    styleUrl: './produits.component.scss'
})
export class ProduitsComponent implements OnInit {


    typeRecherche!: string;

    first = 0;
    rows = 10;


    imageUrl = ""

    idd?: number;
    produits: Produit[] = [];
    ListRechercherProduits:Produit[]=[];
    historiques: Historique[] = [];
    selectedProducts: Produit [] = [];
    deleteProductsDialog: boolean = false;
    displayusers: boolean = true;
    images: any[] = [];
    visible: boolean = false;
    loadingdata: boolean = false;
    loading: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    initTabProduit: Produit[]=[];
    produitsPage: Page<Produit>={
        content:this.initTabProduit,number:0,size:0,totalPages:0,totalElements:0

    };
    currentPage: number = 0;
    pageSize: number = 10; // Nombre d'éléments par page

    constructor(
                private produitService: ProduitService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private router: Router,
                private sanitizer: DomSanitizer) {
        //this.produits = this.fetchProducts();// ?????

    }

    ngOnInit() {
       this.getAllProduits();
        this.loadProduits(this.currentPage, this.pageSize);
    }


    // loadProduits(page: number, size: number) {
    //     this.loadingdata=true ;
    //     this.produitService.LoadProduits(page, size).subscribe(
    //         (data: Page<Produit>) => {
    //             this.produitsPage = data;
    //             this.loadingdata=false;
    //         },
    //         (error) => {
    //             console.error('Erreur lors du chargement des produits', error);
    //         }
    //     );
    // }
    loadProduits(page: number, size: number) {
        this.loadingdata = true;
        this.produitService.LoadProduits(page, size).subscribe(
            (data: Page<Produit>) => {
                this.produitsPage = data;
                this.loadingdata = false;
            },
            (error) => {
                console.error('Erreur lors du chargement des produits', error);
                this.loadingdata = false; // Arrêter le chargement en cas d'erreur
            }
        );
    }



    get currentProducts() {
        const start = this.currentPage * this.pageSize;
        return this.produits.slice(start, start + this.pageSize);
    }

    onPageChange(event: any) {
        console.log( new JsonPipe().transform(event ))
        this.currentPage = event.page==undefined?0:event.page;
        this.pageSize = event.rows==undefined?10:event.rows

      this.loadProduits(this.currentPage,this.pageSize  );

    }


    next() {
        if (!this.isLastPage()) {
            this.currentPage++;
            this.loadProduits(this.currentPage, this.pageSize);
         }
    }

    prev() {
        if (!this.isFirstPage()) {
            this.currentPage--;
            this.loadProduits(this.currentPage, this.pageSize);

        }

    }


    reset() {
        this.currentPage = 0; // Réinitialise à la première page
        this.loadProduits(this.currentPage, 10);

    }

    pageChange(event) {
        this.currentPage = event.page;  // Numéro de la page actuelle (index basé sur 0)
        this.pageSize = event.rows;     // Nombre d'éléments par page
        this.first = event.first;
        this.currentPage = Math.floor(this.first / this.pageSize);
        this.loadProduits(this.currentPage, this.pageSize);
    }

    isFirstPage() {
        return this.currentPage === 0;
    }




    isLastPage() {
        return (this.currentPage + 1) * this.pageSize >= this.produitsPage.totalElements;
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
                this.ListRechercherProduits=value;
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
                            this.loadProduits(this.currentPage, this.pageSize);

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


    // onGlobalFilter(table: Table, event: Event) {
    //     table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    // }
    filteredListRechercherProduits: any[] = [];
    onGlobalFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.toLowerCase();



        // Filtrer manuellement ListRechercherProduits
        this.produitsPage.content = this.ListRechercherProduits.filter((produit) => {
            console.log("produitRechercher"+produit)
            return this.applyFilter(produit, filterValue);
        });
    }

    // Fonction pour vérifier si un produit correspond au filtre
    applyFilter(produit: any, filterValue: string): boolean {
        // Vous pouvez adapter cette fonction pour inclure les champs pertinents
        return produit.nom.toLowerCase().includes(filterValue) ;
            // produit.dataqr.toLowerCase().includes(filterValue);

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
        this.loadProduits(this.currentPage, this.pageSize);

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