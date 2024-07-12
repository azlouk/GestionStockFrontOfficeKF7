import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import Swal from "sweetalert2";
import {Produit} from "../../../../models/produit";
import {ProduitService} from "../../../../layout/service/produit.service";
import {Router} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {DatePipe} from "@angular/common";
import { ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {SliderModule} from "primeng/slider";
import {MultiSelectModule} from "primeng/multiselect";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-canvas',
  standalone: true,
    imports: [
        DatePipe,
        FormsModule,
        SliderModule,
        MultiSelectModule,
        TableModule,
        DialogModule,
        ButtonModule
    ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',


})
export class CanvasComponent implements OnInit{
    produits: Produit[] = [];
    produitsFiltres :Produit[] = [];
    produitsFactures:Produit[] = [];
    nbProduit : number= 0;
    @Input() message: Produit | undefined;
    @Output() onMessage = new EventEmitter<Produit>();
    ProduitInter : Produit[]=[];

    statuses!: any[];
    rechercheProduit: string = '';
    loading: boolean = true;

    activityValues: number[] = [0, 100];
    visible: boolean=false;


    constructor(private produitService : ProduitService,
    ) {
        // customize default values of offcanvas used by this component tree

    }
    ngOnInit(): void {
        this.getAllProduits();

        this.produitsFiltres = [];
        this.produitsFactures =[];

    }
    clear(table: Table) {
        table.clear();
    }


    getAllProduits(){
        this.produitService.getProduits().subscribe(value => {
            this.ProduitInter=value
            this.loading=false;
        }, error => {
        })
    }


    addToFacture(produitInterface: Produit) {
        const p : Produit=new Produit()
        const existingProduct = this.produitService.produitsFactures.find(product => product.id === p.id); // Supposons que les produits ont un attribut id pour l'identification

        if (existingProduct) {
            Swal.fire({
                icon: 'warning',
                title: 'Produit déjà dans la facture',
                text: 'Ce produit est déjà dans la facture !',
                confirmButtonText: 'OK'
            });
        } else {
            //this.produitsFactures.push(p);
            this.onMessage.emit(p);

            // console.log(this.produitsFactures)
        }
    }

    showDialog() {
        this.visible=true ;
    }
}
