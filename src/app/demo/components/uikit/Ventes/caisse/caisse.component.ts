import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {Vente} from "../../../../../models/Vente";
import {getUserDecodeID} from "../../../../../../main";
import {Produit} from "../../../../../models/produit";
import {FormGroup, FormsModule} from "@angular/forms";
import {Message} from "primeng/api/message";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {VenteService} from "../../../../../layout/service/vente.service";
import {ClotureService} from "../../../../service/cloture.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {SaveUrlFileProduct} from "../../../../../models/File";
import {LigneVente} from "../../../../../models/LigneVente";
import {Table, TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {CommonModule, CurrencyPipe, DatePipe, DecimalPipe, NgClass} from "@angular/common";
import {CheckboxModule} from "primeng/checkbox";
import {InplaceModule} from "primeng/inplace";
import {InputNumberModule} from "primeng/inputnumber";
import {DialogModule} from "primeng/dialog";
import {ImageModule} from "primeng/image";
import {AvatarModule} from "primeng/avatar";
import {ToastModule} from "primeng/toast";
import {BadgeModule} from "primeng/badge";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";
import {ToggleButtonModule} from "primeng/togglebutton";
import {AutoFocusModule} from "primeng/autofocus";
import {Cloture} from "../../../../../models/Cloture";
import {SidebarModule} from "primeng/sidebar";
import {FactureComponent} from "../../Factures/facture/facture.component";
import {FactureAjoutComponent} from "../../Factures/facture-ajout/facture-ajout.component";

@Component({
    selector: 'app-caisse',
    standalone: true,
    imports: [
        FormsModule,
        DropdownModule,
        NgClass,
        CheckboxModule,
        InplaceModule,
        InputNumberModule,
        DecimalPipe,
        DialogModule,
        ImageModule,
        AvatarModule,
        DatePipe,
        CurrencyPipe,
        ToastModule,
        BadgeModule,
        InputGroupModule,
        InputGroupAddonModule, InputTextModule, TableModule,
        CommonModule, ToggleButtonModule, AutoFocusModule, SidebarModule, FactureComponent, FactureAjoutComponent
    ],
    templateUrl: './caisse.component.html',
    styleUrl: './caisse.component.scss'
})
export class CaisseComponent implements OnInit{
    @ViewChild('dv') dv: DataView | undefined;

    focusIndex = 0;
    searchTerm: string = '';
    masquer = true;


    produits: Produit[] = [];
    produitsFiltres: Produit [] = [];
    cloture : Cloture = new Cloture();

    listeVente : Vente[]=[];

    selectedVente: Vente=new Vente() ;
    checked: boolean = true;
    divVisible: boolean = true;
    visible: boolean = false;
    show : boolean = false;
    identifiant = 0;


    position: string = 'top';
    loading: boolean = true;
    IsvisiblePop: boolean = false;
    layout: any = 'list';
    searchproductselling: any = '';
    autoimprimer: boolean = false;
    DateCReation: Date = new Date();
    visibleimage: boolean = false;
    newCloture!: FormGroup;
    frais: number=0;
    reglement: number=0;




    activityValues: number[] = [0, 100];
    currentDate: string = this.formatDate(new Date());


    TotalProductNb: number = 0;

    TotalAndReglement:any={total:0,reglement:0};

    // Ajoutez cette méthode pour formater la date au format 'YYYY-MM-DD'
    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    @ViewChild('searchInput') searchInput!: ElementRef;
    @ViewChild('ajouterProduitButton') ajouterProduitButton!: ElementRef;
    messages1: Message[] = [];

    ngOnInit(): void {
        this.getAllProduits();
        this.messages1 = [{severity: 'error', summary: 'Error', detail: 'Pas des images'}];
    }

    toggleDivVisibility() {
        this.divVisible = !this.divVisible;
    }

    constructor(private produitService: ProduitService,
                public venteService: VenteService,
                private clotureService : ClotureService,
                private renderer: Renderer2,
                private route: Router,
                private messageService: MessageService,
                private sanitizer: DomSanitizer
    ) {
        const idrandom=1;
        this.selectedVente=new Vente(idrandom,new Date().toString(),'client '+idrandom,0,0,[],getUserDecodeID());
        this.listeVente.push(this.selectedVente);
        this.reglement = this.selectedVente.total;
    }

    SaveVente() {
        if (this.selectedVente.lignesVente.length != 0) {

            this.getTotalVente();
            this.selectedVente.reglement=this.reglement ;
            this.produitService.SaveVente(this.selectedVente).subscribe(value => {
                console.log("Result Vente :" + value);
                if (value ) {
                    this.showTopCenter("Votre Vente est bien enregistré ")
                    if (this.autoimprimer) {
                        //let timerInterval: string | number | NodeJS.Timeout | undefined;
                        Swal.fire({
                            title: "Auto close alert!",
                            html: "I will close in <b></b> milliseconds.",
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                                // @ts-ignore
                                // const timer = Swal.getPopup().querySelector("b");
                                // timerInterval = setInterval(() => {
                                //     // @ts-ignore
                                //     timer.textContent = `${Swal.getTimerLeft()}`;
                                // }, 100);
                            },
                            /* willClose: () => {
                                 clearInterval(timerInterval);
                             }*/
                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                console.log("I was closed by the timer");
                                this.imprimer()
                            }
                        });

                    } else {
                        this.clearVente();
                    }
                }
            })
        } else {
            Swal.fire({
                title: "Pas de vente ?",
                text: "SVP ajouter des produits ",
                icon: "info"
            });
        }
    }

    getAllProduits() {
        this.produitService.getProduits().subscribe((value: any) => {
            this.produits = value;
        })
    }

    clearVente() {
        this.selectedVente.lignesVente = [];
        this.selectedVente.reglement = 0;
        this.TotalProductNb = 0;

    }




    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {


        switch (event.key) {
            case 'F1':
                this.focusIndex = 1;
                console.log(`Focus set to Button 0`);
                this.sidebarVisibleFacture = true;

                break;
            case 'F2':
                this.focusIndex = 2;
                event.preventDefault();
                console.log(`Focus set to Button 1`);
                // Déclencher le clic sur le bouton "Ajouter Produit"
                if (this.ajouterProduitButton != undefined)
                    this.ajouterProduitButton.nativeElement.click();

                this.searchTerm = '';
                break;
            case 'Enter':
                break;
            case 'F3':
                this.searchTerm = '';
                this.focusIndex = 3;
                event.preventDefault();
                console.log(`Focus set to Button 2`);
                this.focusOnSearchInput();
                break;
            case 'F4':
                this.focusIndex = 4;
                event.preventDefault();
                console.log(`Focus set to Button 3`);
                this.showDialog();
                break;
            case 'F5':
                this.focusIndex = 5;
                event.preventDefault();
                console.log(`Focus set to Button 4`);
                this.focusOnSupprimerButton();
                break;
            case 'F6' :
                this.focusIndex = 6;
                this.route.navigate(["/home"])
                break;
            case 'F7':
                this.focusIndex = 7;
                event.preventDefault();
                console.log(`Focus set to Button 6!`);
                this.showClotureDIv();
                break;
            case 'F8' :
                this.focusIndex = 8;
                this.toggleDivVisibility();
                break;
            case 'F10' :
                this.focusIndex = 10;
                this.SaveVente();
                break;
            case 'F9': {

                this.focusIndex = 9;
                if (this.selectedVente.lignesVente.length != 0) {
                    Swal.fire({
                        title: "Vous étes sur ?",
                        text: "supprission définitif",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Oui, Vider Tout"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.clearVente();

                            Swal.fire({
                                title: "Vider!",
                                text: "Votre vente est bien effacé",
                                icon: "success"
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        title: "Vider ?",
                        text: "Votre vente est déja vide",
                        icon: "info"
                    });
                }
                break;
            }

        }
    }

    onButtonClick(index: number): void {

        switch (index) {
            case 1 :
                this.focusIndex = 1;
                this.sidebarVisibleFacture=true
                break;

            case 2:
                this.focusIndex = 2;

                console.log(`Focus set to Button 1`);
                // Déclencher le clic sur le bouton "Ajouter Produit"
                if (this.ajouterProduitButton != undefined)
                    this.ajouterProduitButton.nativeElement.click();

                this.searchTerm = '';
                break;
            case 3:

                this.searchTerm = '';
                this.focusIndex = 3;
                console.log(`Focus set to Button 2`);
                this.focusOnSearchInput();
                break;
            case 4:
                this.focusIndex = 4;
                console.log(`Focus set to Button 3`);
                this.showDialog();
                break;
            case 5:
                this.focusIndex = 5;
                console.log(`Focus set to Button 4`);
                this.focusOnSupprimerButton();
                break;
            case 6 :
                this.focusIndex = 6;
                this.route.navigate(["/home"])
                break;
            case 7:
                this.focusIndex = 7;
                console.log(`Focus set to Button 6!`);
                this.showClotureDIv();
                break;
            case 8 :
                this.focusIndex = 8;
                this.toggleDivVisibility();
                break;
            case 10 :
                this.focusIndex = 10;
                this.SaveVente();
                break;
            case 9: {
                if (this.selectedVente.lignesVente.length != 0) {
                    Swal.fire({
                        title: "Vous étes sur ?",
                        text: "supprission définitif",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Oui, Vider Tout"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.clearVente();

                            Swal.fire({
                                title: "Vider!",
                                text: "Votre vente est bien effacé",
                                icon: "success"
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        title: "Vider ?",
                        text: "Votre vente est déja vide",
                        icon: "info"
                    });
                }
                break;
            }

        }

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

    safeImageUrl: SafeUrl[] = [];

    productSaveUrl: SaveUrlFileProduct[] = [];

    createImageUrl(blob: Blob): SafeUrl {
        const imageUrl = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    loadFile(filesList: File[]): void {
        this.safeImageUrl = [];
        this.visibleimage = true;
        console.error(filesList)
        filesList.forEach(value => {
            this.produitService.getImageProduit(value.name).subscribe(
                (data: Blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const blobUrl = URL.createObjectURL(data);
                        this.safeImageUrl.push(blobUrl);

                    };
                    reader.readAsText(data);
                },
                error => {
                    console.error('Error loading file:', error);
                }
            );
        });

    }


    search(): void {
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
        console.log('Produits filtrés: dATA', this.produitsFiltres);
    }
    showTopCenter(message: string) {
        this.messageService.add({key: 'tc', severity: 'warn', summary: 'Warn', detail: message});
    }

    ajouterProduitSelectionne(index: number): void {
        if (index >= 0 && index < this.produitsFiltres.length) {
            const produitSelectionne = this.produitsFiltres[index];

            const ligneExistante = this.selectedVente.lignesVente.find(ligne => ligne.produit.id === produitSelectionne.id);

            if (ligneExistante) {
                if (ligneExistante.venteQty < ligneExistante.produit.qantite)
                    ligneExistante.venteQty += 1;
                else {
                    this.showTopCenter('Quantité ' + ligneExistante.produit.nom + ' est Depassé' + 'il vous reste ' + ligneExistante.produit.qantite)
                }

            } else {
                // Créer une nouvelle ligne de vente
                const ligneVente = new LigneVente();
                ligneVente.id = produitSelectionne.id;
                ligneVente.venteQty = 1; // Vous pouvez ajuster la quantité initiale ici
                ligneVente.prixVente = produitSelectionne.prixUnitaire + produitSelectionne.gainUnitaire;

                ligneVente.produit = produitSelectionne;

                // Ajouter la ligne de vente à la liste
                this.selectedVente.lignesVente.unshift(ligneVente);

                this.focusOnSearchInput();

            }
        }
        this.searchTerm = '';
    }

    updatePrixVente(ligneVente: LigneVente): void {
        const produit = ligneVente.produit;

        if (ligneVente.venteQty >= produit.minQuantiteGros) {
            ligneVente.prixVente = produit.prixGros + produit.gainGros;
        } else {
            ligneVente.prixVente = produit.prixUnitaire + produit.gainUnitaire;
        }
        this.getTottalNbProduct()

    }

    getTottalNbProduct() {
        this.TotalProductNb = 0;

        this.selectedVente.lignesVente.forEach(value => {
            this.TotalProductNb += value.venteQty;
        })
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


    supprimerProduit(index: number): void {
        // Check if the index is valid
        if (index >= 0 && index < this.selectedVente.lignesVente.length) {
            // Remove the selected product from the list
            this.selectedVente.lignesVente.splice(index, 1);
            this.getTottalNbProduct()
        }
    }

    /* getContenuImprimer(): string {
       const contenuImprimer = document.getElementById('contenuImprimer');
       return contenuImprimer ? contenuImprimer.innerHTML : '';
     }
     imprimerFacture(): void {
       // Obtenez le contenu que vous souhaitez imprimer
       const contenuImprimer = this.getContenuImprimer();

       // Affichez le contenu dans une alerte
       if (contenuImprimer) {
         alert(contenuImprimer);
       }
     }**/


    imprimer(): void {
        // Récupérez le contenu que vous souhaitez imprimer
        const contenuImprimer = document.getElementById('contenuImprimerTICKet');

        if (contenuImprimer)
            Swal.fire({
                title: "Imprission",
                html: contenuImprimer.innerHTML,
                width: 800,
                heightAuto: true,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Imprimer'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (contenuImprimer) {
                        // Ouvrez une nouvelle fenêtre avec des dimensions spécifiées
                        const fenetreImpression = window.open('', 'PRINT', 'width=600,height=600');

                        if (fenetreImpression) {
                            // Ajoutez le contenu à la fenêtre d'impression
                            fenetreImpression.document.write('<html lang="fr"><head><title>Imprimer</title></head><body>');
                            fenetreImpression.document.write(contenuImprimer.innerHTML);
                            fenetreImpression.document.write('</body></html>');

                            // Appelez la fonction d'impression
                            fenetreImpression.document.close();
                            fenetreImpression.print();
                            fenetreImpression.close();
                            this.clearVente();
                        } else {
                            // Gestion d'erreur si la fenêtre n'a pas pu être ouverte
                            console.error('La fenêtre d\'impression n\'a pas pu être ouverte.');
                        }
                    }
                }
            });

    }

    clear(table: Table) {
        table.clear();
    }

    getTotalVente(): number {
        const val = this.getSommeTotale() + this.getSommeTaxes()+this.frais;
        this.selectedVente.total=val;

        return this.selectedVente.total;
    }



    private showClotureDIv() {
        this.clotureService.getTotalClotureNow(new Date()).subscribe(value => {
            this.TotalAndReglement=value ;
        })

        this.show = !this.show
    }

    saveCloture() {
        this.cloture.employer.id = getUserDecodeID().id;
        this.cloture.dateCloture = new Date();

        this.clotureService.SaveCloture(this.cloture).subscribe(
            value => {
                console.log(value);
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
            inputValue:"client " +(this.listeVente.length +1) ,
            inputLabel: "nom client!",
            inputPlaceholder: "nom du clients"
        });
        if (nomClient) {



            if(this.selectedVente.lignesVente.length != 0){



                this.selectedVente=new Vente(this.listeVente.length +1,new Date().toString(),nomClient,0,0,[],getUserDecodeID()) ;
                this.listeVente.push(this.selectedVente) ;
                this.getTottalNbProduct()


                console.log("ligne Ventes:",this.listeVente);
            }
            else {
                Swal.fire({
                    title: "Vider  !",
                    text: "Votre vente est déja vidé",
                    icon: "error"
                });        }
        }
    }
    switchVente(vente:Vente){
        this.getTottalNbProduct()

        this.selectedVente = vente;

        console.log("SelectedVente",this.selectedVente)

    }


    protected readonly top = top;
    sidebarVisibleFacture: boolean=false;
}
