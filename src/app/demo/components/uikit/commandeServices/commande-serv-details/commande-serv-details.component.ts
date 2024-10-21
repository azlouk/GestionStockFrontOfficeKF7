import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {ProduitService} from "../../../../../layout/service/produit.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommandeServ} from "../../../../../models/CommandeServ ";
import {CommandeServiceService} from "../../../../../layout/service/commande-service.service";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-commande-serv-details',
  standalone: true,
  imports: [
    ButtonModule,
    CurrencyPipe,
    RippleModule,
    SharedModule,
    TableModule
  ],
  templateUrl: './commande-serv-details.component.html',
  styleUrl: './commande-serv-details.component.scss'
})
export class CommandeServDetailsComponent implements OnInit{

  commandeSer:CommandeServ = new CommandeServ(); // Initialisez votre objet Facture

  @ViewChild('factureContent') factureContent!: ElementRef;
  constructor(
      private commandeService: CommandeServiceService,
      private produitService : ProduitService,
      private route: ActivatedRoute,
      private router : Router,
  ) {}

  ngOnInit(): void {
    this.getFactureDetails(); // Appelez la méthode pour récupérer les détails de la facture
  }

  getFactureDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.commandeService.getCommandeById(id)?.subscribe((value: CommandeServ) => {
      this.commandeSer = value; // Mettez à jour l'objet facture avec les détails récupérés
    });
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

      returnBack(): void {
        this.router.navigate(['/uikit/Commandes'])  }

}
