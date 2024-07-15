import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {Facture, factureType} from "../../../../../models/Facture";
import {Depot} from "../../../../../models/Depot";
import {Produit} from "../../../../../models/produit";
import {RoleEnum, User} from "../../../../../models/user";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
 import {LigneFacture} from "../../../../../models/LigneFacture";
import {FactureService} from "../../../../../layout/service/facture.service";
import {DepotService} from "../../../../../layout/service/depot.service";
import {UserService} from "../../../../../layout/service/user.service";
import {ProduitService} from "../../../../../layout/service/produit.service";
import {Router} from "@angular/router";
import {getUserDecodeID} from "../../../../../../main";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {ListboxModule} from "primeng/listbox";
import {Table, TableModule} from "primeng/table";
import {CommonModule, DecimalPipe} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {MessagesModule} from "primeng/messages";
import {CanvasComponent} from "../../canvas/canvas.component";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {MultiSelectModule} from "primeng/multiselect";
import {SliderModule} from "primeng/slider";
import {CardModule} from "primeng/card";
import {RippleModule} from "primeng/ripple";
import {InputSwitchModule} from "primeng/inputswitch";
import {ToggleButtonModule} from "primeng/togglebutton";
import {InputTextModule} from "primeng/inputtext";
@Component({
  selector: 'app-facture-ajout',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CalendarModule,
        ListboxModule,
        TableModule,
        DecimalPipe,
        InputNumberModule,
        MessagesModule,
        CanvasComponent,
        DropdownModule,
        CommonModule,
        DialogModule,
        MultiSelectModule,
        SliderModule,
        CardModule,
        RippleModule,
        InputSwitchModule,
        ToggleButtonModule,
        InputTextModule
    ],
  templateUrl: './facture-ajout.component.html',
  styleUrl: './facture-ajout.component.scss'
})
export class FactureAjoutComponent implements OnInit{
    // newFacture = new Facture(0, '', 0, [],0, 0,0, 0,new Date(),new Date(), factureType.SORTIE, new User(0,'','','',0,'',undefined,''),new Depot(1,'','',0,0,''));
    newFacture = new Facture();
    depots: Depot[] = [];
    produits: Produit[] = [];
    utilisateurs: User[] = [];
    utilisateursClients : User[] = [];
    providers : User[]=[];
    produitsFiltres :Produit[];
    rechercheProduit: string = '';
    userForm: FormGroup;
    roles = Object.values(RoleEnum);
    dateSysteme: Date = new Date();
    autoReference: boolean = true;
    composantBVisible = false;
    utilisateursTransporteur:User[]=[];
    produitsFactures: LigneFacture[]=[];
    ligneProduits : Produit [] = [];
    activityValues: number[] = [0, 100];

    selectedDepot: any=null;
    idDepot : number =0;
    idClient : number=0;
    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
    clear(table: Table) {
        table.clear();
    }
    constructor(
        private cdr: ChangeDetectorRef,
        private factureService: FactureService,
        private depotService: DepotService,
        private userService: UserService,
        private produitService: ProduitService,
        private router:Router,
        private formBuilder: FormBuilder,

    ) {
        this.produitsFactures=[]
        this.produitsFiltres=[]
        this.userForm = this.formBuilder.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            tel: ['', Validators.required],
            address: ['', Validators.required],
            role: ['', Validators.required],
        });
        this.newFacture.dateCreation=new Date() ;
    }

    ngOnInit(): void {
        this.newFacture.typeFacture=factureType.SORTIE
        console.log(this.newFacture.typeFacture)
        this.calculeFactureTotal()
        this.dateSysteme = new Date();
        this.depotService.getDepotByIdRes(getUserDecodeID().id).subscribe((value:Depot) => {
            this.newFacture.depot=value
            // console.log(this.newFacture.depot)
        },error => {
        });
        this.getAllUsers();
        this.getAllTrans();
        this.getAllProvider();
        this.getAllProduits()
        this.getAllDepots();
    }
    toggleComposantB() {
        this.composantBVisible = !this.composantBVisible;
    }

    getAllDepots() {
        this.depotService.getdepots().subscribe((value: Depot[]) => {
            this.depots = value;
            console.log(this.depots);
            //console.log('List of services:', this.services);
        });
    }
    filtrerProduits(recherche: string) {
        console.log(recherche)
        this.produitsFiltres = this.produits.filter((produit:Produit) => {
            return produit.nom.includes(recherche)||
                produit.dataqr.includes(recherche)
        });
    }
    getAllUsers(){
        this.userService.getUsersClient().subscribe((value :User[])=>{
            this.utilisateurs=value
            // console.log(new JsonPipe().transform(this.utilisateurs) )
        })
    }
    getAllTrans(){
        this.userService.getUsersTransporteur().subscribe((value :User[])=>{
            this.utilisateursTransporteur=value
        })
    }
    getAllProvider(){
        this.userService.getUsersProviders().subscribe((value :User[])=>{
            this.providers=value
        })
    }
    getAllProduits(){
        this.produitService.getProduits().subscribe((value :any)=>{
            this.produits=value ;
            // console.error(""+new JsonPipe().transform(this.produits))
        })
    }

    createNewFacture(): void {
        this.newFacture.lignesFacture = this.produitsFactures;

        // Validation des champs obligatoires
        if (!this.validateFacture()) {
            return;
        }

        // Affichage du contenu de la facture dans la console
        console.log('Contenu de la facture à enregistrer :', this.newFacture);

        // Configuration de SweetAlert avec des boutons personnalisés
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success ml-2",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        // Demande de confirmation pour le paiement de la facture
        swalWithBootstrapButtons
            .fire({
                title: "Cette facture est payée ?",
                text: "Vous ne pourrez pas revenir en arrière !",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui, payée",
                cancelButtonText: "Non",
                reverseButtons: true
            })
            .then((result) => {
                this.newFacture.paye = result.isConfirmed;

                // Appel à l'API pour ajouter la facture
                this.factureService.addFacture(this.newFacture).subscribe(
                    (response) => {
                        swalWithBootstrapButtons.fire({
                            title: "Enregistrement",
                            text: "Votre facture est bien enregistrée",
                            icon: "success"
                        });
                        this.router.navigate(['/uikit/facture']);
                    },
                    (error) => {
                        this.newFacture = new Facture();
                        this.router.navigate(['uikit/add-facture']);
                        console.error('API error:', error);
                    }
                );
                this.resetForm();
            });
    }

// Fonction de validation des champs de la facture
    validateFacture(): boolean {
        if (this.newFacture.depot.id == 0) {
            Swal.fire({
                title: 'Erreur',
                icon: 'error',
                text: 'Aucun Dépot n\'a été sélectionné pour la facture'
            });
            return false;
        } else if (this.newFacture.lignesFacture.length == 0) {
            Swal.fire({
                title: 'Erreur',
                icon: 'error',
                text: 'Aucun produit n\'a été ajouté à la facture'
            });
            return false;
        } else if (this.newFacture.client.id == 0 && this.newFacture.typeFacture !== 'FACTURE_ACHAT') {
            Swal.fire({
                title: 'Erreur',
                icon: 'error',
                text: 'Aucun client n\'a été ajouté à la facture'
            });
            return false;
        } else if (this.newFacture.provider.id == 0 && this.newFacture.typeFacture == 'FACTURE_ACHAT') {
            Swal.fire({
                title: 'Erreur',
                icon: 'error',
                text: 'Aucun fournisseur n\'a été ajouté à la facture'
            });
            return false;
        } else if (this.newFacture.transporteur.id == 0) {
            Swal.fire({
                title: 'Erreur',
                icon: 'error',
                text: 'Aucun transporteur n\'a été ajouté à la facture'
            });
            return false;
        }
        return true;
    }

    resetForm(): void {
        this.newFacture = new Facture();
    }


    closeResult = '';





    // insertion nouvel client
    RolesData: any=RoleEnum.CLIENT;
    Tax : any=19;


    onSubmit(): void {
        if (this.userForm.valid) {
            const userData = this.userForm.value;
            const newUser = new User(
                userData.id, // Générez l'ID de l'utilisateur
                userData.nom,
                userData.prenom,
                userData.email,
                userData.tel,
                userData.address,
                userData.role,
            );
            this.userService.addUser(newUser);
            this.userService.getUsers()
            this.userForm.reset();
            console.log("new user", newUser)
        }
    }
    deleteProduct(p: LigneFacture): void {
        this.produitsFactures=this.produitsFactures.filter(value => value.produit.id!==p.produit.id)
        this.calculeFactureTotal();
    }

    calculeFactureTotal() {

        this.newFacture.montant=0;
        this.produitsFactures.forEach(value => {
            if(value.quantite>value.produit.qantite)
            {
                value.quantite=value.produit.qantite ;
            }
            if(value.quantite<value.produit.minQuantiteGros) {
                this.newFacture.montant += value.quantite * (value.produit.prixUnitaire + value.produit.gainUnitaire);
                value.montantTotal=value.quantite * (value.produit.prixUnitaire + value.produit.gainUnitaire);
                console.log(value.montantTotal);
            }      else {
                this.newFacture.montant+=value.quantite * (value.produit.prixGros+ value.produit.gainGros) ;
                value.montantTotal = value.quantite * (value.produit.prixGros+ value.produit.gainGros)
                console.log(value.montantTotal);
            }
        })
    }



    parentMessage:Produit =new Produit();

    receiveMessage(message: Produit) {
        const lignFacture:LigneFacture=new LigneFacture(Date.now(),1,0) ;
        lignFacture.produit=message ;
        // this.newFacture.ligneFacture.push(lignFacture);
        const foundp:number=this.produitsFactures.findIndex(value => value.produit.id===message.id)
        //  alert(foundp)
        if(foundp!==-1 ){
            if(this.produitsFactures[foundp].quantite< this.produitsFactures[foundp].produit.qantite) {
                this.produitsFactures[foundp].quantite += 1;
                this.calculeFactureTotal();
                //  alert(this.produitsFactures[foundp].produit.nom)

            }
        }else {
            this.produitsFactures.push(lignFacture)
            this.calculeFactureTotal();

        }
        // alert(JSON.stringify(message))
        // alert('Received message in parent:'+ new JsonPipe().transform(message));
    }

    getPrixCalculate(l: LigneFacture):number {
        if(l.quantite<l.produit.minQuantiteGros) {
            return l.produit.prixUnitaire + l.produit.gainUnitaire;
        } else {
            return  l.produit.prixGros+l.produit.gainGros ;
        }
    }

    changeType() {
        this.newFacture.typeFacture = this.newFacture.typeFacture === factureType.SORTIE
            ? factureType.ENTREE
            : factureType.SORTIE;
        // Manually trigger change detection
        this.cdr.detectChanges();
        console.log(this.newFacture.typeFacture)
    }

    returnBack() {
        this.factureService.returnBack();
    }
    addToFacture(produitInterface: Produit) {
        // Vérifier si le produit existe déjà dans la facture
        const existingProduct = this.produitsFactures.find(product => product.produit.id === produitInterface.id);
        if (existingProduct) {
            Swal.fire({
                icon: 'warning',
                title: 'Produit déjà dans la facture',
                text: 'Ce produit est déjà dans la facture !',
                confirmButtonText: 'OK'
            });
        } else {
            // si le produit n'existe pas creer une nouvelle ligne de facture

            const ligneFacture: LigneFacture = new LigneFacture();
            ligneFacture.produit = produitInterface;
            ligneFacture.quantite = 1;
            ligneFacture.montantTotal = 0;
            this.produitsFactures.push(ligneFacture);
            Swal.fire({
                icon: 'success',
                title: 'Produit ajouté à la facture',
                text: 'Le produit a été ajouté avec succès à la facture !',
                confirmButtonText: 'OK'
            });
        }
    }


}

