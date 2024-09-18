import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {RippleModule} from "primeng/ripple";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import Swal from "sweetalert2";
import {CodeModel, Produit} from "../../../../../models/produit";
import {CommonModule, DatePipe, JsonPipe} from "@angular/common";
import {FileUploadModule} from "primeng/fileupload";
import {Table, TableModule} from "primeng/table";
import {Article} from "../../../../../models/Article";
import {ActivatedRoute, Router} from "@angular/router";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {ToastModule} from "primeng/toast";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {ListboxModule} from "primeng/listbox";
import {GenerationcodeComponent} from "../../../utilities/generationcode/generationcode.component";
import {GenerationqrComponent} from "../../../utilities/generationqr/generationqr.component";
import {NgxBarcode6Module} from "ngx-barcode6";
import {File} from "../../../../../models/File";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {CardModule} from "primeng/card";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ArticleService} from "../../../../../layout/service/article.service";
import {ArticleComponent} from "../../Articles/article/article.component";
import {DialogService} from "../../../../../layout/service/dialogue-user.service";
import {Historique} from "../../../../../models/historique";

@Component({
    selector: 'app-produit-ajout',
    standalone: true,
    imports: [
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        PaginatorModule,
        RippleModule,
        SharedModule,
        DatePipe,
        ToastModule,
        ConfirmPopupModule,
        CalendarModule,
        DialogModule,
        TableModule,
        ListboxModule,
        FileUploadModule,
        GenerationcodeComponent,
        GenerationqrComponent,
        ButtonModule,
        NgxBarcode6Module,
        CommonModule,
        CardModule,
        ConfirmDialogModule,
        ArticleComponent
    ],
    templateUrl: './produit-ajout.component.html',
    styleUrl: './produit-ajout.component.scss'
})
export class ProduitAjoutComponent implements OnInit {
    newProduct: Produit = (new Produit());
    selectedImage: any;
    SelectedFile: Blob = new Blob();
    uploadedFiles: any[] = [];
    safeImageUrl: SafeUrl[] = [];
    @Output() dataToParent = new EventEmitter<string>();
    @ViewChild('dt11') dv: DataView | undefined;

    subdataqr: CodeModel[] = [];
    loading: boolean = false;

    activityValues: number[] = [0, 100];
    searchCode: string = '';
    newCodeGroupe: string = '';

    codeISvalide = true;
    visibleDetails: boolean = false;
    product: Produit = new Produit();
    SearchArticle: string = '';
    articles: Article[] = [];
    selectedArticle: Article = new Article();
    showButtunprod: boolean = true;
    root: string;

    public articleDialog: boolean = false;
    public submitted: boolean = false;
    article: Article = new Article();
    newArticleunite: string[] = ['G', 'CM', 'ML', 'PIECE'];
    private historiques: Historique[];

    constructor(public produitService: ProduitService,
                public articleService: ArticleService,
                public dialogueService: DialogService,
                private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService) {
        this.data = "kndjh";

    }

    async ngOnInit(): Promise<void> {
            this.updateRootFromCurrentPath();
            const id = this.route.snapshot.paramMap.get('id');
            try {
                if (id && !this.shouldStayOnSamePageFacture()) {
                    // Attendre que les données du produit soient chargées
                    const product = await this.produitService.getProduitById(Number(id)).toPromise();
                    this.newProduct = product;
                    this.newProduct._dateFabrication = new Date(product._dateFabrication);
                    this.newProduct._dateExpiration = new Date(product._dateExpiration);

                    // Check if _subdataqr is defined and is an array
                    if (Array.isArray(product._subdataqr)) {
                        product._subdataqr.forEach(value1 => {
                            this.subdataqr.push({id: value1, code: value1});
                        });
                    } else {
                        console.warn("Product _subdataqr is not an array or is undefined", product._subdataqr);
                    }

                    // Ensure _filesList is properly handled
                    if (Array.isArray(product._filesList)) {
                        this.loadFile(product._filesList);
                    } else {
                        console.warn("Product _filesList is not an array or is undefined", product._filesList);
                    }
                }

                // Attendre que les articles soient chargés
                const articles = await this.produitService.getArticles().toPromise();
                this.articles = articles;
                console.log("Produit récupéré !!", this.newProduct);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            }

            this.produitService.getArticles().subscribe((value: Article[]) => {
                this.articles = value;
            });

    }

    ajouterProduit() {
        if (!this.newProduct.nom?.trim()) {
            this.messageService.add({severity: 'error', summary: 'Nom produit !', detail: 'Nom de produit invalide'});
            return;
        } else if (!this.newProduct.article.nom || Object.keys(this.newProduct.article).length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Article vide!',
                detail: 'Les détails de l\'article ne peuvent pas être vides'
            });
            return;
        } else if (!this.codeISvalide) {
            this.messageService.add({
                severity: 'error',
                summary: 'Code est dupliqué !',
                detail: 'Votre code barre doit être unique SVP !'
            });
            return;
        } else if (this.newProduct.prixUnitaire <= 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Prix invalide!',
                detail: 'Prix unitaire doit être supérieur à 0 SVP !'
            });
            return;

        } else {
            this.newProduct.subdataqr = this.subdataqr.map((value: CodeModel) => value.code);


            if (this.newProduct.id) {
                this.produitService.modifierProduit(this.newProduct, this.uploadedFiles).subscribe(
                    response => {
                        if (response) {
                            this.newProduct = new Produit(); // Réinitialisation du formulaire après la mise à jour
                            Swal.fire('Succès', 'Le produit a été mis à jour avec succès', 'success');
                            this.router.navigate(['/uikit/produits']);
                        } else {
                            Swal.fire('Erreur Duplication', 'Code Barre Ou QR Existe déjà', 'error');
                        }
                    },
                    error => {
                        console.error('Erreur lors de la mise à jour du produit :', error);
                        Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour du produit', 'error');
                    }
                );
            } else {


                this.produitService.addProduit(this.newProduct, this.uploadedFiles).subscribe(
                    response => {
                        if (response) {
                            this.confirmationService.confirm({
                                message: 'Le produit a été ajouté avec succès. Voulez-vous consulter la liste des produits ?',
                                accept: () => {
                                    this.newProduct = new Produit(); // Réinitialisation du formulaire après l'ajout
                                    this.router.navigate(['/uikit/produits']);
                                },
                                reject: () => {
                                    this.newProduct = new Produit(); // Réinitialisation du formulaire après l'ajout
                                }
                            });
                        } else {
                            Swal.fire('Erreur Duplication', 'Code Barre Ou QR Existe déjà', 'error');
                        }
                    },
                    error => {
                        console.error('Erreur lors de l\'ajout du produit :', error);
                        Swal.fire('Erreur', 'Une erreur s\'est produite lors de l\'ajout du produit', 'error');
                    }
                );
            }
        }
    }




    clear(table: Table) {
        table.clear();
    }

    onUpload(event: any) {
        if (event && event.files) {
            for (let file of event.files) {
                this.uploadedFiles.push(file);
            }
            this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
        }
    }

    confirm() {
        console.log(this.newProduct._dataqr)
        this.codeISvalide = true;
        if (this.newProduct._dataqr.trim() !== '') {
            this.produitService.getProduitByQrNom(this.newProduct._dataqr).subscribe(value => {
                if (value !== null) {
                    Swal.fire({
                        title: "Dublication de code!",
                        text: "Code à barre ou Qr doit etre unique",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: 'afficher',
                        cancelButtonText: 'annuler',
                    }).then((value1) => {
                        if (value1.isConfirmed) {
                            this.product = value;
                            this.visibleDetails = true;
                        }
                    });
                    this.codeISvalide = false
                } else {
                    this.codeISvalide = true;
                }
            })
        }

    }

    loadFile(filesList: File[]): void {
        // this.showDialog()
        this.safeImageUrl = [];
        filesList.forEach(value => {
            this.produitService.getImageProduit(value.name).subscribe(
                (data: Blob) => {
                    this.uploadedFiles.push(data)
                    console.log(this.uploadedFiles)
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const blobUrl = URL.createObjectURL(data);
                        this.safeImageUrl.push(this.sanitizer.bypassSecurityTrustUrl(blobUrl));

                    };
                    reader.readAsText(data);
                },
                error => {
                    console.error('Error loading file:', error);
                }
            );
        });

    }


    onFileSelected(event: any) {
        if (event.target.files && event.target.files[0]) {
            this.SelectedFile = event.target.files[0];
            // @ts-ignore
            // alert(this.SelectedFile.name)
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImage = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
            // Vous pouvez également envoyer l'image vers un service ou stocker les données de l'image selon vos besoins.
            // event.target.files[0] contient le fichier image sélectionné
        }
    }


    setDataCode($event: string) {
         this.newProduct.dataqr = $event;

    }

    returnBack() {
        this.produitService.returnBack()
    }

    setprixgros() {
        this.newProduct._prixGros = this.newProduct._prixUnitaire
    }

    setQtyGros() {
        this.newProduct._minQuantiteGros = this.newProduct._qantite
    }

    setGain() {
        this.newProduct._gainGros = this.newProduct._gainUnitaire
    }

    removeQR(code: CodeModel) {
        let data: CodeModel[] = [];
        this.subdataqr.forEach(value => {
            if (code.id !== value.code)
                data.push(value)
            console.log(value)
        });
        this.subdataqr = data;
    }

    addtolistCode() {
        if (this.newCodeGroupe.trim() !== '') {
            this.produitService.getProduitByQrNom(this.newCodeGroupe).subscribe((value: Produit) => {
                if (value !== null) {
                    Swal.fire({
                        title: "Dublication de code!",
                        text: "Code à barre ou Qr doit etre unique",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: 'afficher',
                        cancelButtonText: 'annuler',
                    }).then((value1) => {
                        if (value1.isConfirmed) {
                            this.product = value;
                            this.visibleDetails = true;
                        }
                    });
                } else {
                    if (this.subdataqr.find((value: CodeModel) => value.id === this.newCodeGroupe) == undefined && this.newCodeGroupe !== this.newProduct._dataqr) {
                        this.subdataqr.push({id: this.newCodeGroupe, code: this.newCodeGroupe});
                        this.newCodeGroupe = ''

                    } else {
                        Swal.fire('Erreur Duplication', 'Code Barre  Existe déja dans le groupe', 'error');

                    }
                }
            })

        }
    }

    cleartolistCode() {
        this.subdataqr = [];
    }

    imprimer(id: string): boolean {
        const printContents = document.getElementById(id).innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;

        return true;
    }

    private updateShowButtun(): void {
        this.showButtunprod = !this.root.includes('add-facture');
    }

    private updateRootFromCurrentPath(): void {
        this.root = this.router.url; // Récupère le chemin actuel
        this.updateShowButtun();
        console.log("root", this.root)
    }

    clearFiles() {
        this.uploadedFiles = [];
    }


    protected readonly EventEmitter = EventEmitter;
    data: string = "gfg";


    public openPopArticle() {

        this.articleDialog = true;

    }

    public hideDialog() {

        this.articleDialog = false;

    }

    addArticle() {
        this.submitted = true;
        if (this.article.nom.trim() == '') {
            Swal.fire({
                title: "Nom article Obligatoire !",
                text: "Nom article est vide",
                icon: "error"
            });
        } else if (this.article.unite == undefined) {
            Swal.fire({
                title: "Unité Obligatoire !",
                text: "G , CM , ML ,Piéce",
                icon: "error"
            });
        } else {
            this.produitService.addArticle(this.article).subscribe(value => {


                this.article = new Article();

                this.getAllArticles();
                Swal.fire({
                    title: "Enregistrement",
                    text: "votre article est bien enregistré",
                    icon: "success"
                });
            }, error => {
                console.log(error)
            })
        }
        this.hideDialog();
    }


    getAllArticles() {
        this.produitService.getArticles().subscribe((value: Article[]) => {
            this.articles = value;
        }, error => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vous n'avez pas la permission s'il vous plait  contacter l'administrateur.  ",

            });
        })
    }

    public addNewArticle() {
        this.dialogueService.openDialogueArticle();
    }


    shouldStayOnSamePageFacture():boolean {
        const currentUrl = this.router.url;
        return currentUrl.includes('/update-facture');
    }

}


