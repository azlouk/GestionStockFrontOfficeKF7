import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import Swal from "sweetalert2";
import {Facture} from "../../../../../models/Facture";
import {Produit} from "../../../../../models/produit";
import {FactureService} from "../../../../../layout/service/facture.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {ToolbarModule} from "primeng/toolbar";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-facture-details',
  standalone: true,
  imports: [
    ButtonModule,
    DatePipe,
    RippleModule,
    ToolbarModule,
    TableModule,
    NgForOf,
    CurrencyPipe
  ],
  templateUrl: './facture-details.component.html',
  styleUrl: './facture-details.component.scss'
})
export class FactureDetailsComponent implements OnInit {
  facture: Facture = new Facture(); // Initialisez votre objet Facture

  @ViewChild('factureContent') factureContent!: ElementRef;
  constructor(
      private factureService: FactureService,
      private produitService : ProduitService,
      private route: ActivatedRoute,
      private router : Router,
  ) {}

  ngOnInit(): void {
    this.getFactureDetails(); // Appelez la méthode pour récupérer les détails de la facture
  }

  getFactureDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.factureService.getFactureById(id)?.subscribe((value: Facture) => {
      this.facture = value; // Mettez à jour l'objet facture avec les détails récupérés
    });
  }

  returnBack(): void {
    this.factureService.returnBack()
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
          <title>Facture</title>
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
}

