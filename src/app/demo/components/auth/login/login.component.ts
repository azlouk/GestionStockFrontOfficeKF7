import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {AuthentificationService} from "../../../service/authentification.service";
import {Router} from "@angular/router";
import {User} from "../../../../models/user";
import {setToken} from "../../../../../main";
import Swal from "sweetalert2";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    user: User = new  User();
    invalidLogin: boolean = false;
    username : string ="";
    password : string ="";
    loginError: boolean = false;
    visible: boolean=false;
    emailRecuperation: string='';

    constructor(private authService : AuthentificationService,private router: Router ,public layoutService: LayoutService) { }
    onClicked(){

        this.loginError = false; // Réinitialisez le drapeau d'erreur à chaque tentative de connexion

        this.authService.login(this.username, this.password).subscribe(
            (response :any) => {
                console.log(JSON.stringify(response.token))// Assurez-vous que la propriété token est correcte selon votre réponse d'API
                setToken(response.token)
                this.router.navigate(['/']);

            },
            error => {
                Swal.fire({title:"Erreur ",text:"Vérifier votre données",icon:"error"})
                console.error('Login failed:', error);
                this.loginError = true;
            }
        );
        console.log("loggedin",this.authService.loggedIn)
    }
}
