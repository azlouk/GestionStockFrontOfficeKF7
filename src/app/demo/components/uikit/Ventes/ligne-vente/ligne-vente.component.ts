import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {VenteService} from "../../../../../layout/service/vente.service";
import {Vente} from "../../../../../models/Vente";
import {CommonModule, CurrencyPipe, DatePipe, JsonPipe} from "@angular/common";
import {Produit} from "../../../../../models/produit";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {RippleModule} from "primeng/ripple";
import {Router} from "@angular/router";



@Component({
  selector: 'app-ligne-vente',
  standalone: true,
    imports: [
        FormsModule,
        InputNumberModule,
        ButtonModule,
        TableModule,
        CurrencyPipe,
        DialogModule,
        DatePipe,
        CommonModule,
        RippleModule
    ],
  templateUrl: './ligne-vente.component.html',
  styleUrl: './ligne-vente.component.scss'
})
export class LigneVenteComponent implements OnInit {
    ventes: Vente[] = [];
    visibleDetails: boolean=false;
    searchTerm: string='';
    showTable : boolean= false;
    displayusers: boolean=true;
    constructor(private venteService: VenteService,private router: Router,) { this.displayusers=true; }

    ngOnInit(): void {
        this.loadVentes();
    }

    loadVentes(): void {
        this.loading=true;
        this.venteService.getVentes().subscribe(
            (ventes: Vente[]) => {
                this.ventes = ventes;
                this.loading=false ;
                this.getAllTotal();
                console.log('Ventes:', new JsonPipe().transform(ventes));
            },
            (error: any) => {
                console.error('Error fetching ventes:', error);
                this.displayusers=false;
                Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Vous n'avez pas la permission s'il vous plait  contacter l'administrateur.  ",


                    }
                );})
    }

    // loadVentes(): void {
    //   this.loading = true;
    //   this.venteService.getVentes().subscribe(
    //     (ventes: Vente[]) => {
    //       this.ventes = ventes;
    //       this.loading = false;
    //       this.getAllTotal();
    //       console.log('Ventes:', JSON.stringify(ventes));
    //     },
    //     (error: any) => {
    //       console.error('Error fetching ventes:', error);
    //       this.displayusers = false;
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: "Vous n'avez pas la permission s'il vous plaît contacter l'administrateur."
    //       });
    //     }
    //   );
    // }
    goToClotures(): void {
        this.router.navigate(['/uikit/cloture']); // Redirection vers la page de modification avec l'ID du produit
    }
    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'default-value'
        }
    }

    getStatusSeverity(status: string) {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            default:
                return 'default-value'; // ou renvoyez une valeur par défaut appropriée
        }
    }

    removeVente(id:number) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        Swal.fire({
            title: "Vous etes sur !",
            text: "Votre Vente sera supprimé définitivement ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, Supprimé!",
            cancelButtonText: "Non, Annuler!!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.venteService.removeVente(id).subscribe(value => {
                    if(value==true)
                    {
                        this.loadVentes()
                        Swal.fire({
                            title: "Vente !",
                            text: "Votre vente est bien supprimé!",
                            icon: "success"
                        });
                    }
                })


            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    title: "Annuler",
                    text: "Annulation de supprission",
                    icon: "error"
                });
            }
        });
    }

    product:Produit=new Produit() ;
    loading: boolean=false;
    detailproduit(produit: Produit) {
        this.product=produit ;
        this.visibleDetails=true

    }
    refrech() {
        this.loadVentes();
    }
    toggleTable() {
        this.showTable = !this.showTable;
    }

    visibleLigneVente(vente : Vente) {
        vente.visible = !vente.visible
    }

    total:number=0;
    DateStart: Date=new Date();
    DateFin:Date=new Date();
    getAllTotal() {
        this.total=0  ;
        this.ventes.forEach(value => {
            console.log(value.dateVente)
            if(new Date(value.dateVente+"").getTime()>=new Date(this.DateStart).getTime() && new Date(value.dateVente+"").getTime()<=new Date(this.DateFin).getTime() )
                this.total+=value.total;

        })
    }
    // getAllTotal(): void {
    //   this.total = 0;
    //   const dateFormat = 'DD-MM-YYYY HH:mm:ss';
    //
    //   // Parsing start and end dates
    //   const startDate = moment(this.DateStart, dateFormat).toDate();
    //   const endDate = moment(this.DateFin, dateFormat).toDate();
    //
    //   this.ventes.forEach(value => {
    //     const venteDate = moment(value.dateVente, dateFormat).toDate();
    //     if (venteDate >= startDate && venteDate <= endDate) {
    //       this.total += value.total;
    //     }
    //   });
    //
    //   console.log('Total ventes entre', this.DateStart, 'et', this.DateFin, ':', this.total);
    // }

}
