import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {Tranche} from "../../../../models/Tranche";
import {TrancheService} from "../../../../layout/service/tranche.service";
import {Router} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {CurrencyPipe, DatePipe, NgClass, NgIf} from "@angular/common";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";

@Component({
  selector: 'app-tranche',
  standalone: true,
  imports: [
    ButtonModule,
    FormsModule,
    TableModule,
    DatePipe,
    CurrencyPipe,
    NgClass,
    AvatarModule,
    BadgeModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    NgIf,
    RippleModule,
    ToastModule,
    ToolbarModule
  ],
  templateUrl: './tranche.component.html',
  styleUrl: './tranche.component.scss'
})
export class TrancheComponent implements OnInit{
  tranches : Tranche [] = [];
  searchTerm: string='';
  newTranche :Tranche = new Tranche();
  loading: boolean = true;
  displayusers: boolean=true;
  ajoutTr: boolean=false;
  constructor(public trancheService: TrancheService,
              private router: Router) { this.displayusers=true;
  }

  ngOnInit(): void {
    this.getAllTranches();
    this.trancheService.exist("tranche")
  }
  getAllTranches(): void {
    this.loading=true;
    this.trancheService.getTranches().subscribe(
        (tranches: Tranche[]) => {
          this.tranches = tranches;
          this.loading=false ;
          //this.calculerCout();
          console.log('Services:', tranches);
        },
        (error: any) => {
          console.error('Error fetching ventes:', error);
          this.displayusers=false;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Vous n'avez pas la permission s'il vous plait  contacter l'administrateur.  ",

          })
        }
    );
  }

  rechercher(): void {
    this.tranches = this.trancheService.rechercheTranche(this.searchTerm);
  }



  addTranche() {
    this.router.navigate(['/tranche-add']);
  }
  modifierTranche(tranche :Tranche){
    console.log('tranche sélectionné pour modification :', tranche.id);
    this.router.navigate(['/tranche-edit', tranche.id]);
  }

  refrech() {

  }

  showDialogCreate() {

  }

}
