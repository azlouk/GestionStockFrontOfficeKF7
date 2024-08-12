import {Component, OnInit, ViewChild} from '@angular/core';
import {Article, UNITE} from "../../../../../models/Article";
import {Table, TableModule} from "primeng/table";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {CurrencyPipe, JsonPipe, NgClass, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {ListboxModule} from "primeng/listbox";
import {BadgeModule} from "primeng/badge";
import {AvatarModule} from "primeng/avatar";
import Swal from "sweetalert2";
import {FileUploadModule} from "primeng/fileupload";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {Router} from "@angular/router";
import {Produit} from "../../../../../models/produit";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RadioButtonModule} from "primeng/radiobutton";
import {ArticleService} from "../../../../../layout/service/article.service";
import {MessageService} from "primeng/api";
import {DialogService} from "../../../../../layout/service/dialogue-user.service";

@Component({
    selector: 'app-article',
    standalone: true,
    imports: [
        ButtonModule,
        TableModule,
        DialogModule,
        FormsModule,
        ListboxModule,
        BadgeModule,
        AvatarModule,
        CurrencyPipe,
        FileUploadModule,
        ImageModule,
        InputTextModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        DropdownModule,
        InputNumberModule,
        InputTextareaModule,
        NgIf,
        RadioButtonModule,
        NgClass
    ],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
    articles: Article[]=[];
    article:Article=new Article();
    selectedArticles: Article [] = [];
    loading: boolean = false;
    SearchArticle: string = '';
    visibleArticle: boolean = false;

    newArticleunite: string[] = ['G', 'CM', 'ML', 'PIECE'];
    displayusers: boolean = true;

    @ViewChild("dt1") table ?: TableModule
    public articleDialog: boolean = false;
    public submitted: boolean = false;
    public deleteProductDialog: boolean=false;
    public deleteProductsDialog: boolean=false;

    constructor(public produitService: ProduitService,private messageService: MessageService,
                private router: Router,private articleService :ArticleService,public dialogueService:DialogService) {
        this.displayusers = true;

    }

    ngOnInit(): void {
        this.getAllArticles();
        this.produitService.existArticle("article");
    }

    ShowPopArticle() {
        this.visibleArticle = !this.visibleArticle;

    }

// print
    getAllArticles() {
        this.produitService.getArticles().subscribe((value: Article[]) => {
            this.articles = value;
        }, error => {
            this.displayusers = false;
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vous n'avez pas la permission s'il vous plait  contacter l'administrateur.  ",

            });
        })
    }

    removeArticle(article: Article) {

        Swal.fire({
            title: "tu es sûr ?",
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, supprimez-le !"
        }).then((result) => {
            if (result.isConfirmed) {

                this.produitService.deleteArticle(article).subscribe(value => {
                    if (value == true) {
                        Swal.fire({
                            title: "supprimé!",
                            text: "Votre article a été supprimé.",
                            icon: "success"
                        });
                        this.getAllArticles();
                    }
                })

            }
        });
    }

    editArticle(article: Article) {
        this.articleDialog=true
        this.article = article;
    }

    showDialogCreate() {
        this.articleDialog = true;
    }

    addArticle() {
        this.submitted = true;
        this.showDialogCreate();
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
this.dialogueService.closeDialogueArticle()

                this.article = new Article();
                this.ShowPopArticle();
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    deleteArticle(article: Article) {
        this.deleteProductDialog = true;
        this.article = article ;

    }

    confirmDeleteSelected() {

        console.log(this.selectedArticles.length)
        this.selectedArticles.forEach(selectedArticle => {
            this.articleService.deleteArticle(selectedArticle.id).subscribe(
                () => {
                    this.articles = this.articles.filter(article =>article.id !== selectedArticle.id);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Article Deleted', life: 3000 });

                },
                (error) => {
                    console.error('Error deleting user:', error);
                }
            );
        });
        this.deleteProductDialog = false;
    }
    confirmDelete() {

        console.log("this.article.id", this.article.id);

        if (this.article.id!= null) {
            this.articleService.deleteArticle(this.article.id).subscribe(() => {
                console.log("article deleted")
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'article Deleted', life: 3000 });
                this.getAllArticles();
            });
        }

        this.deleteProductDialog = false;
    }

    public hideDialog() {
        this.articleDialog = false;
    }

    protected readonly UNITE = UNITE;
    public displayfacture: boolean=false;


    deleteSelectedArticles() {

        this.deleteProductsDialog = true;

    }

    refresh() {
        this.getAllArticles()
    }
}
