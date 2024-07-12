
import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RoleEnum, User} from "../../../../../models/user";
import {Depot} from "../../../../../models/Depot";
import {SERVICE} from "../../../../../models/SERVICE";
import {UserService} from "../../../../../layout/service/user.service";
import {Router} from "@angular/router";
import {DepotService} from "../../../../../layout/service/depot.service";
import {CommonModule, JsonPipe} from "@angular/common";
import {IPermission, Permission} from "../../../../../models/permission";
import {ServiceService} from "../../../../../layout/service/service.service";
import {CheckboxModule} from "primeng/checkbox";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import { v4 as uuid4 } from 'uuid';
import {InputNumberModule} from "primeng/inputnumber";
import {MultiSelectModule} from "primeng/multiselect";
import {DropdownModule} from "primeng/dropdown";
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";

@Component({
    selector: 'app-ajout-user',
    standalone: true,
    imports: [
        CheckboxModule,
        FormsModule,
        ButtonModule,
        ReactiveFormsModule,
        TableModule,
        CommonModule,
        InputTextModule,
        InputNumberModule,
        MultiSelectModule,
        DropdownModule,
        PasswordModule,
        RippleModule
    ],
    templateUrl: './ajout-user.component.html',
    styleUrl: './ajout-user.component.scss'
})
export class AjoutUserComponent  implements  OnInit{

    userForm: FormGroup;
    roles = Object.values(RoleEnum).filter(value => value!=='Tous les rôles');
    //attribute Affectation Depot
    SelectedDepotId: any=0;
    ListDepot: Depot[]=[];
    SelectedDepot :Depot;
    //attribute Service
    SelectedServiceId: any=0;
    ListService: SERVICE[]=[];
    SelectedServcie :SERVICE;


    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private  router : Router, private depotService:DepotService, private serviceSERVICE:ServiceService) {

        this.SelectedDepot=new Depot();
        this.SelectedServcie=new SERVICE() ;

        this.userForm = this.formBuilder.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            tel: [ ],
            adresse: ['', Validators.required],
            role: ['', Validators.required],
            motdepasse: [''],
            motdepasseconfirm: [''],
            typeClient:[''],
            solde:[],
            typeEmployer:[''],
            tacheEmployer:[''],
            pseudo:[''],
            attributManager:[""],
            nomSociete:[''],
            telephoneSociete:[],
            adresseSociete:[''],
            emailSociete:[''],

        });
    }

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
    ngOnInit() {
        // this.getAllDepotList() ;
        // this.getAllServiceList() ;
    }
    onSubmit(): void {
        if (this.userForm.valid) {
            const userData = this.userForm.value;
            let user:any = {
                username: "",
                firstname: userData.nom,
                lastname: userData.prenom,
                email: userData.email,
                telephone: userData.tel,
                adresse : userData.adresse,
                role: userData.role,
                permission: this.userPermission,
            };

            switch (user.role.toLowerCase()) {
                case 'admin': {
                    user.pseudo='admin';
                    user.responsableDepotNo=''
                    user.password=userData.motdepasseconfirm;
                    user.pseudo=userData.pseudo;
                    console.log("error data"+user)
                    break
                }
                case 'manager': {
                    user.pseudo='manager';
                    user.responsableDepotNo=''
                    user.password=userData.motdepasseconfirm;
                    user.attributManager=userData.attributManager;
                    console.log("error data"+user)

                    break
                }
                case 'responsable' : {
                    user.pseudo='responsable';
                    user.responsableDepotNo=''
                    user.password=userData.motdepasseconfirm;
                    console.log("error data"+user)
                    break;
                }
                case  'client' : {
                    user.pseudo='client';
                    user.responsableDepotNo=''
                    user.password="client";
                    user.soldeClient= userData.solde;
                    user.typeClient = userData.typeClient;
                    console.log("error data"+user)
                    break
                }
                case 'employer' : {
                    user.pseudo='employer';
                    user.responsableDepotNo=''
                    user.password=userData.motdepasseconfirm;
                    user.typeEmployer = userData.typeEmployer;
                    user.tacheEmployer = userData.tacheEmployer;
                    console.log("error data"+user)
                    break;
                }
                case 'transporteur' : {
                    user.pseudo='transporteur';
                    user.responsableDepotNo=''
                    user.password="trasporteur";
                    console.log("error data"+user)
                    break;
                }
                case  'fournisseur' : {
                    user.pseudo='fournisseur';
                    user.responsableDepotNo=''
                    user.password="fournisseur";
                    user.nomSociete = userData.nomSociete;
                    user.emailSociete = userData.emailSociete;
                    user.adresseSociete = userData.adresseSociete;
                    user.telephoneSociete = userData.telephoneSociete;
                    user.role = "PROVIDER"
                    console.log("error data"+user)
                    break;
                }
            }
            this.userService.addUser(user).subscribe(
                (response) => {
                    console.log("===========>>>>>>>>>>>"+response)
                    if (response) {

                        this.userForm.reset();
                        this.router.navigate(['/uikit/Users']);
                    } else {
                        //RedirectToLogin(this.router);
                    }
                },
                (error) => {
                    console.error(new JsonPipe().transform(error));
                    // Gérer l'erreur, afficher un message à l'utilisateur, etc.
                }
            );

        } else {
            Swal.fire({
                title: 'Erreur de remplissage',
                icon: 'error',
                text: 'Vérifiez bien les champs!'
            });
        }
    }
    dispalyDepot() {
        const depotfound:Depot | undefined=this.ListDepot.find(value => value.id==this.SelectedDepotId) ;
        if(depotfound!==undefined)
            this.SelectedDepot=depotfound ;
    }
    dispalyService() {
        const Servicefound:SERVICE | undefined=this.ListService.find(value => value.id==this.SelectedServiceId) ;
        if(Servicefound!==undefined)
            this.SelectedServcie=Servicefound ;
    }
    ViewDetailResponsable(responsable: User) {
        if(responsable!=null) {
            Swal.fire({
                width: 900,
                html: '<div class="cardResponsable p-1">\n' +
                    '        <button class="mail">\n' +
                    '           \n' +
                    '        </button>\n' +
                    '        <div class="profile-pic shadow-lg">\n' +
                    '            \n' + '<img src="../../assets/no-picture-taking.png">' +
                    '         \n' +
                    '        </div>\n' +
                    '        <div class="bottom">\n' +
                    '            <div class="content">\n' +
                    '                <span class="name text-break">' + responsable.lastname + '  ' + responsable.firstname + '</span>\n' +
                    '                <span class="about-me">' + responsable.email + ' </span>\n' +
                    '            </div>\n' +
                    '           <div class="bottom-bottom">\n' +
                    '            <div class="social-links-container">\n' +
                    '                <span class="name text-break">' + responsable.lastname + '  ' + responsable.firstname + '</span>\n' +
                    '                <span class="about-me text-break">' + responsable.telephone + ' </span>\n' +
                    '            </div>\n' +
                    '                      <span class="about-me bi-person text-danger">' + responsable.role.toLowerCase() + ' </span>  ' +
                    '           </div>\n' +
                    '        </div>\n' +
                    '    </div>',
                showConfirmButton: false,
                showCloseButton: true


            });
        }
        else {
            Swal.fire({title:"Erreur" ,icon:"error",text:'aucun responsable pour cette depot'})
        }

    }
    deleteService(SelectedServcie: SERVICE) {
    }
    editService(SelectedServcie: SERVICE) {
    }
    returnBack() {
        this.userService.returnBack()
    }
    getPermission(tablename:string, apiT:string) {
        const foundPermission=this.userPermission.find(value => value.tableName==tablename && (value.api==apiT || apiT.substring(0,apiT.length-1)==value.api  )) ;
        if(foundPermission!==undefined){
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
        console.log("Table Permisiion :"+ new JsonPipe().transform(this.userPermission))
    }
    getAPI(name:string | undefined):string{
        if(name==='read'){
            return 'afficher'
        } else  if( name ==='update'){
            return 'modifier'
        } else  if( name==='delete'){
            return 'supprimer'
        }else {
            return '' ;
        }
    }
}
