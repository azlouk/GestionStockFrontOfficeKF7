import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthentificationService } from "../../../../layout/service/authentification.service";
import { Router } from "@angular/router";
import { User } from "../../../../models/user";
import { setToken } from "../../../../../main";
import Swal from "sweetalert2";
import { LoginService } from "../../../../layout/service/login.service";
import {UserService} from "../../../../layout/service/user.service";

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

    user: User = new User();
    username: string = "";
    password: string = "";
    loginError: boolean = false;
    visible: boolean = false;
    emailverif: string = "";
    secretKeyverif: string = "";
    showVerif = false;
    public visibleConfirmPass: any=false;
    public newPassword: string;
    public confirmPassword: string;
    public userId:number;

    visibleError: boolean = false;
    visibleSuccess: boolean = false;
    errorMessage: string = 'Votre mot de passe ne pas été mis à jour';
    successMessage: string = 'Votre mot de passe a été mis à jour.';

    constructor(private authService: AuthentificationService, private router: Router,
                public layoutService: LayoutService, private loginService: LoginService,private userService: UserService,
    ) { }

    onClicked() {
        this.loginError = false;

        this.authService.login(this.username, this.password).subscribe(
            (response: any) => {
                setToken(response.token);
                this.router.navigate(['/']);
            },
            error => {
                Swal.fire({ title: "Erreur", text: "Vérifiez vos données", icon: "error" });
                this.loginError = true;
            }
        );
    }

    public showDialogVerif() {
        this.showVerif = true;
    }

    public verifForget() {

        this.loginService.verifForgetPasswor(this.emailverif, this.secretKeyverif).subscribe(
            (user: User) => {
                if (user) {
                   this.userId=user.id;
                    this.showDialogPassword();
                    this.showVerif=false;
                } else {
                    Swal.fire('Erreur', 'Email ou clé secrète incorrecte', 'error');
                }
            },
            error => {
                Swal.fire('Erreur', 'Vérifiez vos informations', 'error');
            }
        );
    }

    // Method to save the new password
    saveNewPassword(userId: number) {
        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = 'Les mots de passe ne correspondent pas.';
            this.visibleError = true;
            return;
        }

        this.loginService.updatePassword(userId, this.newPassword).subscribe(
            ( value :boolean) => {
                 if(value) {
                    this.visibleSuccess = true;
                    this.visibleConfirmPass = false;
                    this.showVerif=false;
                }else {
                    this.errorMessage = 'La mise à jour du mot de passe a échoué.';
                    this.visibleError = true;
                }
            },
            error => {
                console.error(error)
                this.errorMessage = 'La mise à jour erroné';
                this.visibleError = true;
            }
        );
    }

    navigateToLogin() {
        this.visibleSuccess = false;

    }


    public showDialogPassword() {
       this.visibleConfirmPass=true;


    }
}
