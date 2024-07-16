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
      private route: ActivatedRoute
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
    // Implémentez la logique pour retourner en arrière
  }

  saveFacture(): void {
    // Implémentez la logique pour sauvegarder la facture
  }

  printFacture() {
    const printContent = this.factureContent.nativeElement.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }
}

