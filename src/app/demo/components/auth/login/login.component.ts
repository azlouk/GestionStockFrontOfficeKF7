import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthentificationService } from "../../../../layout/service/authentification.service";
import { Router } from "@angular/router";
import { User } from "../../../../models/user";
import { setToken } from "../../../../../main";
import Swal from "sweetalert2";
import { LoginService } from "../../../../layout/service/login.service";
import {UserService} from "../../../../layout/service/user.service";
import {ElectronService} from "../../../../layout/service/electron-service.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
      /* Responsive form container */
      .responsive-form {
        width: 100%;
        max-width: 700px; /* Limit width for larger screens */
        margin: 0 auto;
      }

      /* Full-width input fields */
      .p-inputtext,
      .custom-password-width .p-password-input,
      .custom-password-width input {
        width: 100% !important;
      }

      /* Responsive for smaller devices */
      @media (max-width: 600px) {
        .responsive-form {
          padding: 0 1rem; /* Add padding on small screens */
        }

        .p-inputtext,
        .custom-password-width {
          width: 100% !important;
        }
      }

      /* Eye icon adjustments */
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
      /* Container with responsive layout */
      .responsive-container {
         
        width: 100%;
        padding: 0 1rem;
      }

      /* Custom gradient for the form box */
      .custom-box-gradient {
        border-radius: 56px;
        padding: 0.3rem;
        background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
      }

      /* Responsive form card */
      .responsive-card {
        border-radius: 53px;
        max-width: 500px;
        max-height:500px;
        margin: 0 auto;
      }

      /* Responsive input fields */
      .responsive-input,
      .responsive-password input {
        padding: 1rem;
        width: 100%;
      }

      /* Responsive checkbox and other elements */
      .responsive-checkbox {
        flex-direction: column;
        align-items: flex-start;
      }

      .responsive-button {
        font-size: 1.2rem;
      }

      /* Media queries for smaller screens */
      @media (max-width: 768px) {
        .responsive-card {
          padding: 1rem;
        }

        .responsive-input,
        .responsive-password input {
          width: 100%;
        }

        .responsive-checkbox {
          flex-direction: column;
          gap: 1rem;
        }

        .responsive-button {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .text-3xl {
          font-size: 1.8rem;
        }

        .responsive-input,
        .responsive-password input {
          font-size: 1rem;
          padding: 0.8rem;
        }

        .responsive-button {
          font-size: 1rem;
        }
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

    constructor(private electronService:ElectronService, private authService: AuthentificationService, private router: Router,
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
    resetFormPassword()
    {
        this.newPassword="";
        this.confirmPassword=""
        this.emailverif = "";
        this.secretKeyverif = "";
    }

    // Method to save the new password
    saveNewPassword(userId: number) {

        console.log('Nouveau mot de passe:', this.newPassword);
        console.log('Confirmez le mot de passe:', this.confirmPassword);

        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = 'Les mots de passe ne correspondent pas.';
            this.visibleError = true;
            return;
        }

        this.loginService.updatePassword(userId, this.newPassword).subscribe(
            (value: boolean) => {
                console.log('Résultat de la mise à jour:', value);
                if (value) {
                    this.visibleSuccess = true;
                    this.visibleConfirmPass = false;
                    this.showVerif = false;
                } else {
                    this.errorMessage = 'La mise à jour du mot de passe a échoué.';
                    this.visibleError = true;
                }
            },
            error => {
                console.error('Erreur lors de la mise à jour du mot de passe:', error);
                this.errorMessage = 'La mise à jour erronée';
                this.visibleError = true;
            }
        );
        this.resetFormPassword();
    }


    navigateToLogin() {
        this.visibleSuccess = false;

    }


    public showDialogPassword() {
       this.visibleConfirmPass=true;


    }


}
