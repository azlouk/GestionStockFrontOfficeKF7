import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {UserService} from "../../../../../layout/service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule, JsonPipe} from "@angular/common";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {PasswordModule} from "primeng/password";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {RoleEnum, User} from "../../../../../models/user";
 import {deleteToken, getUserDecodeID} from "../../../../../../main";
import { IPermission } from 'src/app/models/permission';
  
@Component({
    selector: 'app-update-user',
    standalone: true,
    imports: [
        CheckboxModule,
        FormsModule,
        ButtonModule,
        PasswordModule,
        TableModule,
        CommonModule,
        DropdownModule,
        InputNumberModule,
        InputTextModule,
        RippleModule
    ],
    templateUrl: './update-user.component.html',
    styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent implements OnInit {
    user: User =new User();
    useracien: User =new User();
    roles = Object.values(RoleEnum);
    permissions: any[] = [
        {name:'Utilisateurs',tableName:'user',afficher:false,modifier:false,supprimer:false,ajouter:false,icon:'bi-person'},
        {name:'Depots',tableName:'depot',afficher:false,modifier:false,supprimer:false,ajouter:false,icon:'bi-dropbox'},
        {name:'Produits',tableName:'produit',afficher:false,modifier:false,supprimer:false,ajouter:false,icon:'bi-boxes'},
        {name:'Articles',tableName:'article',afficher:false,modifier:false,supprimer:false,ajouter:false,icon:'bi-book'},
        {name:'Factures',tableName:'facture',afficher:false,modifier:false,supprimer:false,ajouter:false,icon:'bi-journals'},
        {name:'Ventes',tableName:'vente',afficher:false,modifier:false,supprimer:false,ajouter:false,icon:'bi-cart4'},
        {name:'Services',tableName:'service',afficher:false,modifier:false,supprimer:false,ajouter:false,icon:'bi-tools'},
        {name:'Payement',tableName:'tranche',afficher:false,modifier:false,supprimer:false,ajouter:false,icon:'bi-currency-exchange'},
    ];
    private userPermission: IPermission[]=[];
    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}
    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            const userId  = params['id'];
            if (userId) {
                this.userService.getUserById(userId).subscribe(
                    (user) => {
                        this.user = user;
                        console.error("User :=> "+new JsonPipe().transform(this.user))
                        for (let i = 0; i < this.permissions.length; i++) {
                            this.permissions[i].supprimer=user.permission.find(value => value.api==='delete' && this.permissions[i].tableName===value.tableName)!=undefined;
                            if(this.permissions[i].supprimer===true){
                                this.userPermission.push({api:'delete',tableName:this.permissions[i].tableName})
                            }
                            this.permissions[i].afficher=user.permission.find(value => value.api==='read' && this.permissions[i].tableName===value.tableName)!=undefined;
                            if(this.permissions[i].afficher===true){
                                this.userPermission.push({api:'read',tableName:this.permissions[i].tableName})
                            }
                            this.permissions[i].ajouter=user.permission.find(value => value.api==='create' && this.permissions[i].tableName===value.tableName)!=undefined;
                            if(this.permissions[i].ajouter===true){
                                this.userPermission.push({api:'create',tableName:this.permissions[i].tableName})
                            }
                            this.permissions[i].modifier=user.permission.find(value => value.api==='update' && this.permissions[i].tableName===value.tableName)!=undefined
                            if(this.permissions[i].modifier===true){
                                this.userPermission.push({api:'update',tableName:this.permissions[i].tableName})
                            }
                        }
                        this.userService.getUsersPassword(this.user.id).subscribe((value :User) => {
                            this.user.password=value.password ;
                            console.log(value)
                        })
                        console.log('user EDit From Data :', new JsonPipe().transform(this.user));
                    },
                    (error) => {
                        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
                    }
                );
            }
        });
    }
    sauvegarderModification(): void {
        // console.log (new JsonPipe().transform(this.user))
        if(this.user.firstname.trim()==''){
            Swal.fire('Erreur nom ', 'nom vide ', 'error');
        }else if(this.user.lastname.trim()==''){
            Swal.fire('Erreur prénom ', '  prénom  vide ', 'error');
        }else if(this.user.email.trim()==""){
            Swal.fire('Erreur email ', 'email vide ', 'error');
        }else { // @ts-ignore
            if( this.user.telephone.toString().trim()==""){
                Swal.fire('Erreur téléphone ', 'téléphone vide plus de 8 chiffre', 'error');
            }else if(this.user.adresse=='' || this.user.adresse==null){
                Swal.fire('Erreur adress ', 'adress vide ', 'error');
            }else if(this.user.passwordConfirm !=='' && this.user.passwordConfirm !== this.user.passwordConfirm1){
                Swal.fire('Erreur mot de passe ', 'Confimer votre mot de passe SVP    ', 'error');
            }else {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: true
                });
                swalWithBootstrapButtons.fire({
                    title: "Êtes-vous sûr ?",
                    text: "Vous ne pourrez pas revenir en arrière!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Confirmer!",
                    cancelButtonText: "Annuler!",
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.userService.modifierUser(this.user).subscribe(
                            (modifiedUser) => {
                                console.log("Utilisateur modifié avec succès :", modifiedUser);
                                swalWithBootstrapButtons.fire({
                                    title: "Modifier!",
                                    text: "L'utilisateur est modifié avec succès!",
                                    icon: "success"
                                });
                                if(this.user.id==getUserDecodeID().id){
                                    deleteToken() ;
                                    // RedirectToLogin(this.router) ;
                                }else {
                                    this.router.navigate(['/uikit/Users']);
                                }},
                            (error) => {
                                console.error('Erreur lors de la modification de l\'utilisateur :', error);
                                swalWithBootstrapButtons.fire({
                                    title: "Erreur!",
                                    text: "Une erreur est survenue lors de la modification de l'utilisateur.",
                                    icon: "error"
                                });
                            }
                        );
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithBootstrapButtons.fire({
                            title: "Annuler",
                            text: "Votre modification est annulée!",
                            icon: "error"
                        });
                        this.router.navigate(['/uikit/Users']);
                    }
                });
            }
        }
    }
    returnBack() {
        this.userService.returnBack()
    }
    getPermission(tablename:string, apiT:string) {
        const foundPermission=this.userPermission.find(value => value.tableName==tablename && (value.api==apiT || apiT.substring(0,apiT.length-1)==value.api  )) ;
        // alert(apiT.substring(0,apiT.length-1))
        if(foundPermission!==undefined){
            // alert(JSON.stringify(foundPermission)) ;
            //console.log("Table Permisiion  before delete :"+ new JsonPipe().transform(this.userPermission))
            let tab: IPermission[]=[];
            this.userPermission.forEach(value => {
                if(!(value.tableName==tablename && apiT.substring(0,apiT.length-1)==value.api )){
                    tab.push(value)
                }
            })
            //console.log("Table Permisiion  after delete :"+ new JsonPipe().transform(tab))
            this.userPermission=tab ;
        } else {
            this.userPermission.push({api:apiT,tableName:tablename})
        }
        this.user.permission=this.userPermission;
        console.log("Table Permisiion :"+ new JsonPipe().transform(this.user.permission))
    }
}
