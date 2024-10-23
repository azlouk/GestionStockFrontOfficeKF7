import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LigneFacture} from "../../../../../models/LigneFacture";
import {FactureVente} from "../../../../../models/FactureVente";
import {FactureVenteService} from "../../../../../layout/service/facture-vente.service";

@Component({
  selector: 'app-facture-vente-details',
  standalone: true,
  imports: [
    ButtonModule,
    CurrencyPipe,
    RippleModule,
    SharedModule,
    TableModule
  ],
  templateUrl: './facture-vente-details.component.html',
  styleUrl: './facture-vente-details.component.scss'
})
export class FactureVenteDetailsComponent implements OnInit{

  facture: FactureVente = new FactureVente(); // Initialisez votre objet FactureVente

  @ViewChild('factureContent') factureContent!: ElementRef;
  constructor(
      private factureVenteService: FactureVenteService,
      private produitService : ProduitService,
      private route: ActivatedRoute,
      private router : Router,
  ) {}

  ngOnInit(): void {
    this.getCommandeDetails(); // Appelez la méthode pour récupérer les détails de la FactureVente
  }

  getCommandeDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.factureVenteService.getFactureById(id)?.subscribe((value: FactureVente) => {
      this.facture = value; // Mettez à jour l'objet FactureVente avec les détails récupérés
    });
  }

  returnBack(): void {
    this.factureVenteService.returnBack()
  }

  saveFacture(): void {
    // Implémentez la logique pour sauvegarder la facture
  }

  printFacture() {
    const printContent = this.factureContent.nativeElement.innerHTML;

    // Créer un iframe temporaire
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    // Positionner l'iframe hors de vue
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();

      // Copier les styles de la page
      const styleSheets = Array.from(document.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules)
                  .map(rule => rule.cssText)
                  .join('\n');
            } catch (e) {
              console.warn('Access to stylesheet is restricted', e);
              return '';
            }
          })
          .join('\n');

      // Écrire le contenu et les styles dans l'iframe
      iframeDoc.write(`
      <html>
        <head>
          <title>FactureVente</title>
          <style>${styleSheets}</style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
      iframeDoc.close();

      // Attendre que le contenu soit chargé et imprimer
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      };
    }
  }

  public getNewPrice(l: LigneFacture) {
    return l.quantite<l.produit.minQuantiteGros?l.prixAchat+l.produit.gainUnitaire:l.prixAchat+l.produit.gainGros;
  }


  public getNewTotal(l: LigneFacture) {
    return l.quantite<l.produit.minQuantiteGros?(l.produit.prixUnitaire + l.produit.gainUnitaire) * l.quantite:(l.produit.prixUnitaire + l.produit.gainGros) * l.quantite;

  }
}
