import {Component, OnInit, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {Facture, FactureInterface} from "../../../../../models/Facture";
import {User} from "../../../../../models/user";
import {Produit} from "../../../../../models/produit";
import {FactureService} from "../../../../../layout/service/facture.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {Button, ButtonDirective} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgClass, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Ripple} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {SliderModule} from "primeng/slider";
import {TagModule} from "primeng/tag";
import {MultiSelectModule} from "primeng/multiselect";
import {SplitButtonModule} from "primeng/splitbutton";
import {Representative} from "../../../../api/customer";
import {ColumnFilterFormElement} from "primeng/table/table";

@Component({
  selector: 'app-facture',
  standalone: true,
    imports: [
        AvatarModule,
        BadgeModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        TableModule,
        ToolbarModule,
        SliderModule,
        TagModule,
        MultiSelectModule,
        SplitButtonModule,
        NgClass
    ],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.scss'
})
export class FactureComponent implements OnInit{

    @ViewChild('dt2') table: Table;

    montantFiltreCalcule: boolean = false;


    totalMontantFiltre: number = 0;

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];



    root : string | undefined;

    factures: Facture[] = [];
    Facturefilred : FactureInterface[]=[];
    client : User = new User();
    searchTerm: string = '';
    produit :Produit[]=[];
    facture : Facture[] = [];
    idp?: number;
    idf?:number ;
    idd?:number;

    rechercheFacture: string = '';

    public selectedFacture: Boolean;
    constructor(
        public factureService: FactureService,
        private router:Router,
        public  activatedRoute : ActivatedRoute){}

    ngOnInit(): void {

        // this.factureService.getCustomersLarge().then((customers) => {
        //     this.customers = customers;
        //     this.loading = false;
        //
        //     this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
        // });



        // if (this.factureService.FactureInter.length!==0){
        //   this.loading=false;
        // }
        // else {
        this.getAllFactures();
        // this.factures=this.getAllFactures();
        // }
        this.root = this.router.url.split('/')[1];
        const idpParam = <string> this.activatedRoute.snapshot.paramMap.get('idp')
        const iddParam = <string> this.activatedRoute.snapshot.paramMap.get('idd')
        if (idpParam !== null) {
            this.idp = +idpParam;
        }

        if (iddParam !== null) {
            this.idd = +iddParam;
        }
        //const sommeMontant = this.myFacture.getSommeMontant();
        //console.log(sommeMontant);
        //alert(this.idp)


    }
    getClient(id: number): User {
        this.factureService.getClient(id).subscribe((value: User) => {
            this.client = value;
        });
        return this.client;
    }
    clear(table: Table) {
        table.clear();
        this.montantFiltreCalcule = false;

    }
    getAllFactures() {
        this.loading = true;
        this.factureService.getFactures().subscribe((value: FactureInterface[]) => {
            this.factureService.FactureInter=value
            this.loading=false;
            this.Facturefilred=value
            console.log('List of factures:', value);
        });
    }

    goToFactureDetails(id: number): void {
        this.router.navigate(['uikit/facture/', id]);
    }
    editFacture(id:number){
        this.router.navigate(['uikit/update-facture/', id]) ;
    }

    addFacture(){
        this.router.navigate(['/uikit/add-facture']);
    }
    onSearch(): void {
        if (this.searchTerm.trim() !== '') {
            this.factures = this.factureService.searchFacture(this.searchTerm.toLowerCase());
        } else {
            this.getAllFactures();
        }
    }

    selectFacture(facture: Facture) {
        this.idf = facture.id;
        console.log('idf:' ,this.idf)
        this.router.navigate(['/ajout-service/',this.idp,this.idf,this.idd]);
    }
    getPayeLabel(paye: boolean): string {
        return paye ? 'Oui' : 'Non';
    }
    getSeverity(status: boolean) {
        switch (status) {
            case true:
                return 'success';
            case false:
                return 'danger';
        }
    }

    getFilter(rechercheFacture: string) : string {
        if (rechercheFacture.toLowerCase()==='oui')
            return 'true';
        else if (rechercheFacture.toLowerCase()==='non')
            return 'false'
        else return rechercheFacture
    }

    refrech() {
        this.getAllFactures();
    }

    deleteFacture(id: number): void {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                this.factureService.deleteFacture(id).subscribe(
                    (response) => {
                        console.log('Facture deleted successfully:', response);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        this.getAllFactures();
                    },
                    (error) => {
                        console.error('Error deleting facture:', error);
                        // Handle error, if needed
                    }
                );
            }
        });

    }


    public AjouterFcture() {

    }

    public deleteSelectedFacture() {

    }

    CalculeMontantFiltrer() {
        const filteredFactures = this.table.filteredValue || this.Facturefilred;
        this.totalMontantFiltre = filteredFactures.reduce((acc, facture) => acc + facture.montant, 0);
        this.montantFiltreCalcule = true;
    }


}

