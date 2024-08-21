import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {RoleEnum, User} from "../../../../../models/user";
import {ActivatedRoute, Router} from "@angular/router";
import {CurrencyPipe, DatePipe, JsonPipe, NgIf} from "@angular/common";
import {UserService} from "../../../../../layout/service/user.service";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressBarModule} from "primeng/progressbar";
import {SharedModule} from "primeng/api";
import {SliderModule} from "primeng/slider";
import {Table, TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {FileUploadModule} from "primeng/fileupload";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {RippleModule} from "primeng/ripple";
@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        ButtonModule,
        CurrencyPipe,
        DatePipe,
        DropdownModule,
        InputTextModule,
        MultiSelectModule,
        ProgressBarModule,
        SharedModule,
        SliderModule,
        TableModule,
        FormsModule,
        ToastModule,
        ToolbarModule,
        FileUploadModule,
        AvatarModule,
        BadgeModule,
        NgIf,
        RippleModule
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent {
    users: User[] = [];
    searchTerm: string = '';
    user!:User;
    roles: RoleEnum[] = [];
    selectedRole: RoleEnum = RoleEnum.ALL;
    displayusers: boolean=true;
    @ViewChild('filter') filter!: ElementRef;

    constructor( private router:Router,
                 public userService:UserService,
                 private route: ActivatedRoute) {
        this.roles = this.getRoles();

        this.displayusers=true;
    }
    ngOnInit(): void {
        this.userService.exist("user")
        this.getUserById();
        this.getAllUsers();
    }

    getAllUsers(){
        this.userService.getUsers().subscribe((value :User[])=>{
            this.users=value ;
            console.error(""+new JsonPipe().transform(this.users))
            console.log(value)


        },error => {
            this.displayusers=false;
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vous n'avez pas la permission s'il vous plait  contacter l'administrateur.  ",

            });})
    }
    getUserById(){
        this.route.params.subscribe((params) => {
            const userId = params['id']; // Supposons que vous utilisez 'id' comme nom du paramètre dans votre route
            if (userId) {
                this.userService.getUserById(userId).subscribe(
                    (user) => {
                        this.user = user;
                    },
                    (error) => {
                        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
                        // Gérer l'erreur, par exemple, afficher un message à l'utilisateur
                    }
                );
            }
        });

    }
    getRoles(): RoleEnum[] {
        return Object.values(RoleEnum)}
    addUser(){
        this.router.navigate(['/uikit/Add-user']);
    }
    onSearch(): void {
        if (this.searchTerm.trim() !== '') {
            this.userService.searchUsers(this.searchTerm.toLowerCase());
            this.users = this.userService.getFilteredUsers();
        } else {
            this.getAllUsers();
        }
    }

    editUser(user: User): void {
        console.log('Utilisateur sélectionné pour modification :', user.id);
        this.router.navigate(['/uikit/Edit-user', user.id]);
    }
    // Importez les modules nécessaires
    selectedUsers: any | boolean;

    deleteUser(user: User): void {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Voulez-vous supprimer cet utilisateur ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                this.userService.deleteUser(user).subscribe(
                    (response: any) => {
                        // Gestion de la réponse en tant que texte
                        console.log( response)
                        if (response==true) {
                            Swal.fire('Supprimé', 'L\'utilisateur a été supprimé avec succès', 'success');
                            this.getAllUsers();
                        } else {
                            Swal.fire('Erreur', 'La suppression annulé, User lié par un autre entité ', 'error');
                        }
                    },
                    (error: any) => {
                        console.error('Erreur lors de la suppression :', error);
                        Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression. Veuillez consulter la console pour plus d\'informations.', 'error');
                    }
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Annulé', 'La suppression a été annulée', 'info');
            }
        });
        console.log("utilisateur" , this.user)
    }

    deleteService(userId: number): void {
        this.users = this.users.filter(user => user.id !== userId);
    }

    filterUsersByRole(): void {
        if (this.selectedRole !==RoleEnum.ALL) {
            this.users = this.userService.getUsersByRole(this.selectedRole);
        } else {
            this.getAllUsers();
        }
    }

    refrech() {
        this.getAllUsers();
        //this.router.navigate(['/uikit/Users']);
    }
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    newUser() {

    }

    deleteSelectedUsers() {

    }
}
