import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {Produit} from "../../../../../models/produit";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {JsonPipe} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-ligne-facture',
  standalone: true,
  imports: [],
  templateUrl: './ligne-facture.component.html',
  styleUrl: './ligne-facture.component.scss'
})
export class LigneFactureComponent implements OnInit {

    focusIndex = 0;
    searchTerm: string = '';
    masquer = true;
    produits: Produit[] = [];
    produitsFiltres: Produit [] = [];
    produitsSelections: Produit[] = [];
    divVisible: boolean = true;

    @ViewChild('searchInput') searchInput!: ElementRef;
    @ViewChild('ajouterProduitButton') ajouterProduitButton!: ElementRef;


    ngOnInit(): void {
        this.getAllProduits() ;
        console.log("Produits", this.produits)
    }

    toggleDivVisibility() {
        this.divVisible = !this.divVisible;
    }

    constructor(private produitService: ProduitService,
                private renderer: Renderer2,private route:Router
    ) {
    }


    getAllProduits(){
        this.produitService.getProduits().subscribe((value :any)=>{
            this.produits=value ;
            console.error(""+new JsonPipe().transform(this.produits))
        })
    }
    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'F2':
                this.focusIndex = 0;
                event.preventDefault();
                console.log(`Focus set to Button 1`);
                // Déclencher le clic sur le bouton "Ajouter Produit"
                this.ajouterProduitButton.nativeElement.click();
                this.searchTerm = '';
                break;
            case 'Enter':
                break;
            case 'F3':
                this.focusIndex = 1;
                event.preventDefault();
                console.log(`Focus set to Button 2`);
                this.focusOnSearchInput();
                break;
            case 'F4':
                this.focusIndex = 2;
                event.preventDefault();
                console.log(`Focus set to Button 3`);
                this.focusOnQuantityInput();
                break;
            case 'F5':
                this.focusIndex = 3;
                event.preventDefault();
                console.log(`Focus set to Button 3`);
                this.focusOnSupprimerButton();
                break;
            case 'F6' :
                this.focusIndex = 4;
                this.route.navigate(["/home"])
                break;
            case 'F8' :
                this.focusIndex = 5;
                this.toggleDivVisibility();
        }
    }

    onButtonClick(index: number): void {
        // Gérer le clic sur le bouton si nécessaire
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
        // Check if there is any product selected
        if (this.produitsSelections.length > 0) {
            // Use Renderer2 to focus on the delete button of the first selected product
            const supprimerButton = this.renderer.selectRootElement('.table .btn-outline-danger');
            if (supprimerButton) {
                supprimerButton.focus();
            }
        }
    }

    search(): void {
        // Filtrer les produits en fonction du terme de recherche
        this.produitsFiltres = this.produits.filter(
            produit =>
                produit.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                produit.dataqr.toLowerCase().includes(this.searchTerm.toLowerCase())
            //produit.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    ajouterProduitSelectionne(index: number): void {
        // Vérifiez que l'index est valide
        if (index >= 0 && index < this.produitsFiltres.length) {
            // Récupérez le produit sélectionné
            const produitSelectionne = this.produitsFiltres[index];

            // Vérifiez si le produit n'est pas déjà dans la liste
            const produitDejaPresent = this.produitsSelections.some(p => p.id === produitSelectionne.id);

            if (!produitDejaPresent) {
                // Ajoutez le produit à la liste des produits sélectionnés
                this.produitsSelections.push(produitSelectionne);
            }
        }
    }

    ajouterProduit(): void {
        // Ajoutez votre logique pour ajouter le produit à la table produitsSelections
        // Dans cet exemple, je vais ajouter le premier produit de la liste filtrée
        if (this.produitsFiltres.length > 0) {
            this.ajouterProduitSelectionne(0);
        }
    }

    calculerTotal(produit: Produit): number {
        // Assurez-vous que la quantité est un nombre valide
        produit.qantite = parseInt(produit.qantite.toString(), 10);

        // Vérifiez si la quantité est un nombre valide et si le prix unitaire est défini
        if (!isNaN(produit.qantite) && produit.prixUnitaire) {
            // Calculez et retournez le total
            return produit.prixUnitaire * produit.qantite;
        }

        // Retournez 0 si la quantité ou le prix n'est pas valide
        return 0;
    }

    getTotalProduitsSum(): number {
        let sum = 0;

        for (const produit of this.produitsSelections) {
            sum += this.calculerTotal(produit);
        }

        return sum;
    }


    supprimerProduit(index: number): void {
        // Check if the index is valid
        if (index >= 0 && index < this.produitsSelections.length) {
            // Remove the selected product from the list
            this.produitsSelections.splice(index, 1);
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
        const contenuImprimer = document.getElementById('contenuImprimer');

        if(contenuImprimer)
            Swal.fire({
                title: "print",
                html: '<div class="overflow-y-scroll" style="hei">+contenuImprimer.innerHTML+</div>',
                width :800,
                heightAuto:true,
                showCancelButton:true,
                showConfirmButton:true ,
                confirmButtonText:'Imprimer'
            }).then((result)=>{
                if(result.isConfirmed){


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
                        } else {
                            // Gestion d'erreur si la fenêtre n'a pas pu être ouverte
                            console.error('La fenêtre d\'impression n\'a pas pu être ouverte.');
                        }
                    }        }
            }) ;

        /*
            if (contenuImprimer) {
              // Ouvrez une nouvelle fenêtre avec des dimensions spécifiées
              const fenetreImpression = window.open('', '_blank', 'width=600,height=600');

              if (fenetreImpression) {
                // Ajoutez le contenu à la fenêtre d'impression
                fenetreImpression.document.write('<html><head><title>Imprimer</title></head><body>');
                fenetreImpression.document.write(contenuImprimer.innerHTML);
                fenetreImpression.document.write('</body></html>');

                // Appelez la fonction d'impression
                fenetreImpression.document.close();
                fenetreImpression.print();
                fenetreImpression.close();
              } else {
                // Gestion d'erreur si la fenêtre n'a pas pu être ouverte
                console.error("La fenêtre d'impression n'a pas pu être ouverte.");
              }
            }

         */
    }
}
