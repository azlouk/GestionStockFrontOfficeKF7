import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import { DataViewModule} from "primeng/dataview";
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


    imageUrl=""

    idd?: number;
    produits: Produit[] = [];
    selectedProducts: Produit []= [];
    deleteProductsDialog: boolean = false;

    displayusers: boolean = true;
    images: any[] = [];
    visible: boolean = false;
    loadingdata: boolean = false;
    loading: boolean = false;
    @ViewChild('filter') filter!: ElementRef;

    responsiveOptions: any[];
    constructor(private productService: ProductService,
                private produitService: ProduitService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private router: Router,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.getAllProduits();
        // this.imageUrl;
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
                console.log(new JsonPipe().transform( this.produits))
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
                        console.log(response)
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

                    this.imageUrl = `http://localhost:8081/img/${file.name}`;

                    let safeUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageUrl);
                    safeImages.push(safeUrl);
                }
            });
        }
        return safeImages;
    }
    //
    // getFileName(filePath: string): string {
    //     // Séparez le chemin en parties en utilisant le séparateur de dossier
    //     const parts = filePath.split('\\');
    //     // Renvoyez le dernier élément du tableau, qui est normalement le nom du fichier
    //     return parts[parts.length - 1];
    // }

    // createSafeImageUrl(filePath: string): SafeResourceUrl {
    //     const fileName = this.getFileName(filePath);
    //     const imageUrl = `http://localhost:8081/img/${fileName}`;
    //     return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    // }
    //
    // getFileName(filePath: string): string {
    //     const parts = filePath.split(/[\\\/]/);
    //     return parts[parts.length - 1];
    // }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    protected readonly JSON = JSON;

    refresh() {
        this.getAllProduits();
        this.router.navigate(['/uikit/produits']);
    }
}